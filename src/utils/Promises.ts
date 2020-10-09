import * as fs from "fs";
import * as automl from "@tensorflow/tfjs-automl";
import * as tf from "@tensorflow/tfjs-node";
import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { EntryResolver } from "../resolvers/EntryResolver"; // add this
import { getConnectionOptions, createConnection } from "typeorm";
import { join } from "path";
import * as canvas from "canvas";
import { post } from "request";
import { stringify } from "querystring";
import { Entry } from "../models/Entry";
import { Date } from "../models/Date";
import { Index } from "../models/Index";
import { PPT } from "../models/PPT";
import { PSMDate, PSMEntry, PSMIndex, PSMPpt } from "../psm/predictionPSM";
import { dateGreaterThanOrEqualTo, dateLessThanOrEqualTo } from "./utils";
import { Tensor3D } from "@tensorflow/tfjs-node";
const Clipper = require("image-clipper");
const boxClient = require("./Box");
const sizeOf = require("image-size");
import googleClient from "./Google";
import * as google from "@google-cloud/automl";

export function launch(): Promise<String> {
  return new Promise(async function (resolve, reject) {
    try {
      const connectionOptions = await getConnectionOptions();
      await createConnection(connectionOptions).catch(reject);
      const schema = await buildSchema({
        resolvers: [EntryResolver],
        validate: false,
      }).catch(reject);
      if (schema !== undefined) {
        const server = new ApolloServer({ schema });
        await server.listen(4000);
        resolve("Server has launched!");
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

// Fetch a file's read stream from BOX API.
export function fetchReadStream(boxFileID: String): Promise<fs.ReadStream> {
  return new Promise(function (resolve, reject) {
    boxClient.default.files.getReadStream(boxFileID, null, function (
      error: any,
      stream: fs.ReadStream
    ) {
      if (error) {
        reject(error);
      } else {
        resolve(stream);
      }
    });
  });
}

// Fetch a file's download URL from BOX API.
export function fetchDownloadURL(boxFileID: String): Promise<string> {
  return new Promise(function (resolve, reject) {
    boxClient.default.files
      .getDownloadURL(boxFileID)
      .then((url: string) => {
        resolve(url);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}

// Pipe a read stream into a write stream.
export function pipe(
  rstream: fs.ReadStream,
  wstream: fs.WriteStream
): Promise<String> {
  return new Promise(function (resolve, reject) {
    rstream.on("end", () => {
      resolve("Success");
    });
    rstream.on("error", reject);
    rstream.pipe(wstream);
  });
}

// Upload a file to BOX API.
export function uploadFile(
  boxFolderID: String,
  name: String,
  stream: fs.ReadStream
): Promise<any> {
  return new Promise(function (resolve, reject) {
    boxClient.default.files
      .uploadFile(boxFolderID, name, stream)
      .then((file: any) => resolve(file))
      .catch(reject);
  });
}

// Clip out a sub image.
export function clip(
  pagePath: string,
  entryName: string,
  boxFolderID: string,
  left: number,
  width: number,
  top: number,
  height: number
): Promise<any> {
  return new Promise(function (resolve, reject) {
    Clipper.configure({
      canvas: canvas,
    });
    Clipper(pagePath, async function (this: any) {
      // Make the cropped item path
      const entryPath = join("src", "temp", "entries", entryName + ".jpg");

      // Crop the image and load it into the entry path.
      this.crop(left, top, width, height).toFile(entryPath, async () => {
        // Create a read stream for uploading.
        const ustream = fs.createReadStream(entryPath);

        // Upload the new cropped entries to box.
        // TODO: handle replacing entries that already exist.
        const result = await uploadFile(
          boxFolderID,
          entryName + ".jpg",
          ustream
        ).catch((err: any) => {
          if (err.statusCode !== 409) reject(err);
        });

        fs.unlinkSync(entryPath);
        resolve(result);
      });
    });
  });
}

// Given the download url of an image, run the nano model through it.
export function nano(url: string): Promise<any> {
  return new Promise(function (resolve, reject) {
    const form_data = {
      urls: url,
    };

    const options = {
      url:
        "https://app.nanonets.com/api/v2/OCR/Model/0767da44-03bd-414b-b864-b4c9781dea10/LabelUrls/",
      body: stringify(form_data),
      headers: {
        Authorization:
          "Basic " +
          Buffer.from("aiSkeln2Q24-dvmmRbckLHLzmISGggdp" + ":").toString(
            "base64"
          ),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    post(options, function (err, httpResponse, body) {
      if (httpResponse.statusCode !== 200) {
        reject(err);
      } else if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

export function parseDateInput(data: PSMDate | Date): Promise<Date> {
  return new Promise(function (resolve, reject) {
    const dte = new Date();

    // There should only be one key per object.
    dte.content = data.content;
    dte.stringified = data.stringified;

    // Do some regex matching here to find the day,month,year.
    const dayMatch = data.stringified.match(new RegExp(/\/\d+\//g));
    if (dayMatch !== null) {
      dte.day = +dayMatch[0].replace(new RegExp(/\//g), "");
    } else {
      reject("no day found");
    }
    const monthMatch = data.stringified.match(new RegExp(/\d+\//g));
    if (monthMatch !== null) {
      dte.month = +monthMatch[0].replace(new RegExp(/\//g), "");
    } else {
      reject("no month found");
    }
    const yearMatch = data.stringified.match(new RegExp(/\/\d+/g));
    if (yearMatch !== null) {
      dte.year = +yearMatch[1].replace(new RegExp(/\//g), "");
    } else {
      reject("no year found");
    }

    resolve(dte);
  });
}

export function parseIndexInput(data: PSMIndex | Index): Promise<Index> {
  return new Promise(function (resolve, reject) {
    const idx = new Index();
    // Do some regex matching here to pull out the book and page.
    // There should only be one key per object.
    try {
      idx.page = +data.stringified;
      idx.content = data.content;
      resolve(idx);
    } catch (err) {
      reject(err);
    }
  });
}

export function parseEntityInput(data: PSMPpt | PPT): Promise<PPT> {
  return new Promise(function (resolve, reject) {
    // Temporary filler entry.
    try {
      const tempPPT = new PPT();
      tempPPT.name = data.name;
      resolve(tempPPT);
    } catch (err) {
      reject(err);
    }
  });
}

// Create the Entry data type needed by Graphql and Mongodb.
export function format(
  entry: PSMEntry,
  boxID: string,
  boxName: string
): Promise<Entry> {
  return new Promise(async function (resolve, reject) {
    try {
      const ent = new Entry();
      // Copy over the easy values.
      ent.boxID = boxID;
      ent.book = boxName.substr(0, 3);

      // These values have to be reduced to one string, from arrays.
      ent.content = entry.content.reduce((acc: any, curr: any) => {
        return (acc += curr);
      }, "");
      ent.header = entry.header.reduce((acc: any, curr: any) => {
        return (acc += curr);
      }, "");

      // These values have to be parsed, and create unique objects.
      ent.dates = await Promise.all(
        entry.dates.map(async function (date: PSMDate) {
          date.content = entry.content[date.pointer];
          let dte = await parseDateInput(date);
          // Check to see if minDate needs to be initialized or updated.
          if (!ent.minDate) {
            ent.minDate = dte;
          } else if (dateLessThanOrEqualTo(dte, ent.minDate)) {
            ent.minDate = dte;
          }

          // Check to see if maxDate needs to be intialized or updated.
          if (!ent.maxDate) {
            ent.maxDate = dte;
          } else if (dateGreaterThanOrEqualTo(dte, ent.maxDate)) {
            ent.maxDate = dte;
          }
          return dte;
        })
      );

      ent.entities = await Promise.all(
        entry.entities.map((ppt: PSMPpt) => {
          return parseEntityInput(ppt);
        })
      );

      ent.indexes = await Promise.all(
        entry.indexes.map((index: PSMIndex) => {
          return parseIndexInput(index);
        })
      );

      resolve(ent);
    } catch (err) {
      reject(err);
    }
  });
}

export function startTFModel(): Promise<automl.ObjectDetectionModel> {
  const modelUrl: string =
    "C://Users/tedra/source/repos/hmjrAPI/src/tf/34hrsTrained/model.json";
  const loadDictionary = (modelUrl: string) => {
    const lastIndexOfSlash = modelUrl.lastIndexOf("/");
    const prefixURL =
      lastIndexOfSlash >= 0 ? modelUrl.slice(0, lastIndexOfSlash + 1) : "";
    const dictUrl: string = `${prefixURL}dict.txt`;
    const text = fs.readFileSync(dictUrl, { encoding: "utf-8" });
    return text.trim().split("\n");
  };
  return new Promise(async function (resolve, reject) {
    try {
      const [model, dict] = await Promise.all([
        tf.loadGraphModel(`file://${modelUrl}`),
        loadDictionary(modelUrl),
      ]);
      resolve(new automl.ObjectDetectionModel(model, dict));
    } catch (err) {
      reject(err);
    }
  });
}

export function decodeImage(imageUrl: string): Promise<Tensor3D> {
  return new Promise(function (resolve, reject) {
    const imgSrc = fs.readFileSync(imageUrl);
    const arrByte: Uint8Array = Uint8Array.from(Buffer.from(imgSrc));
    const imgTensor: Tensor3D = tf.node.decodeJpeg(arrByte, 3);
    if (imgTensor != undefined) {
      resolve(imgTensor);
    } else {
      reject("Tensor was undefined. Check image path.");
    }
  });
}

export async function getPredictor(): Promise<
  (imageurl: string) => Promise<automl.PredictedObject[]>
> {
  const model = await startTFModel();
  return async (imageurl: string) => {
    const decodedImage = await decodeImage(imageurl);
    const data: automl.PredictedObject[] = await model.detect(decodedImage);
    decodedImage.dispose();
    return data;
  };
}

export async function cloudPredict(
  boxID: string
): Promise<google.protos.google.cloud.automl.v1.IPredictResponse> {
  return new Promise(async (resolve, reject) => {
    const pagePath = join("src", "temp", "pages", boxID + ".jpg");
    const wstream = fs.createWriteStream(pagePath);
    const rstream = await fetchReadStream(boxID).catch(reject);

    if (rstream) {
      await pipe(rstream, wstream).catch(reject);
    } else {
      reject("No valid read stream")
    }

    const projectId = "hmjri-280502";
    const location = "us-central1";
    const modelId = "IOD8192261027442720768";
    const content = fs.readFileSync(pagePath);
    const bytes = Uint8Array.from(content);
    const dimensions = sizeOf(pagePath);
    const request = {
      name: googleClient.modelPath(projectId, location, modelId),
      payload: {
        image: {
          imageBytes: bytes,
        },
      },
    };

    fs.unlinkSync(pagePath);
    let [response] = await googleClient.predict(request);
    if (response.payload) {
      response.payload = response.payload.map((item) => {
        if (item.imageObjectDetection) {
          if (item.imageObjectDetection.boundingBox) {
            if (item.imageObjectDetection.boundingBox.normalizedVertices) {
              item.imageObjectDetection.boundingBox.normalizedVertices = item.imageObjectDetection.boundingBox.normalizedVertices.map(
                (vertex) => {
                  if (vertex.x && vertex.y) {
                    const newX = vertex.x * dimensions.width;
                    const newY = vertex.y * dimensions.height;
                    const newVertex: google.protos.google.cloud.automl.v1.INormalizedVertex = { x: newX, y: newY }
                    return newVertex
                  } else {
                    return vertex;
                  }
                }
              )
            }
          }
        }
        return item;
      }
      );
    } else {
      reject("no payload")
    }
    resolve(response);
  });
}

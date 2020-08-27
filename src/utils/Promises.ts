import * as fs from "fs";
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
import { PSMDate, PSMEntry, PSMIndex } from "../psm/predictionPSM";
import { dateGreaterThanOrEqualTo, dateLessThanOrEqualTo } from "./utils";
import { DateInput } from "../inputs/DateInput";
import { IndexInput } from "../inputs/IndexInput";
import { PPTInput } from "../inputs/PPTInput";
const Clipper = require("image-clipper");
const client = require("../utils/Box");

// Launch the server.
export function launch(): Promise<String> {
  return new Promise(async function (resolve, reject) {
    try {
      const connectionOptions = await getConnectionOptions();
      await createConnection(connectionOptions);
      const schema = await buildSchema({
        resolvers: [EntryResolver],
        validate: false,
      });
      const server = new ApolloServer({ schema });
      await server.listen(4000);
      resolve("Server has launched!");
    } catch (err) {
      reject(err);
    }
  });
}

// Fetch a file's read stream from BOX API.
export function fetchReadStream(boxFileID: String): Promise<fs.ReadStream> {
  return new Promise(function (resolve, reject) {
    client.default.files.getReadStream(boxFileID, null, function (
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
    client.default.files
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
    client.default.files
      .uploadFile(boxFolderID, name, stream)
      .then((file: any) => resolve(file))
      .catch((err: any) => reject(err));
  });
}

// Clip out a sub image.
export function clip(
  pagePath: string,
  entryName: string,
  boxFolderID: string,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number
): Promise<any> {
  return new Promise(function (resolve, reject) {
    Clipper.configure({
      canvas: canvas,
    });
    Clipper(pagePath, async function (this: any) {
      // Make the cropped item path
      const entryPath = join("src", "temp", "entries", entryName + ".jpg");

      // Calc the width and height
      const w = xMax - xMin;
      const h = yMax - yMin;
      // Crop the image and load it into the entry path.
      this.crop(xMin, yMin, w, h).toFile(entryPath, async () => {
        // Create a read stream for uploading.
        const ustream = fs.createReadStream(entryPath);

        // Upload the new cropped entries to box.
        // TODO: handle replacing entries that already exist.
        const result = await uploadFile(boxFolderID, entryName, ustream).catch(
          (err: any) => {
            if (err.statusCode !== 409) reject(err);
          }
        );

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

export function parseDateInput(data: DateInput): Promise<Date> {
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

export function parseIndexInput(data: IndexInput): Promise<Index> {
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

export function parseEntityInput(data: PPTInput): Promise<PPT> {
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
        entry.entities.map((ppt: PPTInput) => {
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

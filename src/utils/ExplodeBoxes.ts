import { pipe, fetchReadStream, getPredictor } from "./Promises";
import { BoundingBox } from "../graphql/BoundingBox";
import { join } from "path";
import { createWriteStream, unlinkSync } from "fs";
import { PredictedObject } from "@tensorflow/tfjs-automl";
import { engine } from "@tensorflow/tfjs-core";

export async function explodeBoxes(data: String): Promise<BoundingBox[]> {
  return new Promise(async function (resolve, reject) {
    const pagePath = join("src", "temp", "pages", data + ".jpg");
    const wstream = createWriteStream(pagePath);
    const rstream = await fetchReadStream(data);

    if (rstream === undefined) {
      reject(`Could not fetch file with id ${data}`);
    }

    await pipe(rstream, wstream);

    engine().startScope();
    const predictor = await getPredictor();
    const rawBoxes = await predictor(pagePath);
    engine().endScope();
    const boxes = rawBoxes.map((rawBox: PredictedObject) => {
      return rawBox.box;
    });

    // Delete the temporary file.
    unlinkSync(pagePath);

    resolve(boxes);
  });
}

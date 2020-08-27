import { ExplodeEntriesInput } from "../inputs/ExplodeEntriesInput";
import {
  fetchReadStream,
  pipe,
  clip,
  nano,
  fetchDownloadURL,
  format,
} from "../utils/Promises";
import { predictionPSM } from "../psm/predictionPSM";
import { join } from "path";
import * as fs from "fs";
import { Entry } from "../models/Entry";

const boxFolderID = "117343777715"; // test: 117343777715, production: 116491174022

export async function explodeEntries(
  data: ExplodeEntriesInput
): Promise<Entry[]> {
  return new Promise(async (resolve, reject) => {
    // Create path and stream consts
    // Check for this boxID already
    const pagePath = join("src", "temp", "pages", data.boxID + ".jpg");
    const wstream = fs.createWriteStream(pagePath);
    const rstream = await fetchReadStream(data.boxID);

    if (rstream === undefined) {
      reject(`Could not fetch file with id ${data.boxID}`);
    }

    await pipe(rstream, wstream);

    let sfx = 0;

    // Clip the page into pieces and upload the pieces to BOX.
    const boxResponses = await Promise.all(
      data.boundingBoxes.map((box) => {
        const entryName = data.boxName + "-" + sfx + ".jpg";
        sfx += 1;
        return clip(
          pagePath,
          entryName,
          boxFolderID,
          box.xMin,
          box.xMax,
          box.yMin,
          box.yMax
        );
      })
    );

    // Using their download URLs, run the clips through Nanonets.
    const rawNano = await Promise.all(
      boxResponses.map(async (response) => {
        const boxFileID = response.entries[0].id;
        const url = await fetchDownloadURL(boxFileID);
        return nano(url);
      })
    );

    // Map the API responses into the predictions.
    const parsedNano = rawNano.map((response) => {
      return JSON.parse(response).result[0].prediction;
    });

    // Put these parsed entries through the psm, reducing to a single Entry[].
    const rawEntries = parsedNano.reduce((acc, curr) => {
      const psm = predictionPSM();
      const processed = psm(curr);
      Array.prototype.push.apply(acc, processed.entries);
      return acc;
    }, []);

    // Run the raw entries through the formatter to create the Entry data type needed by GraphQL and MongoDB.
    const parsedEntries = await Promise.all<Entry>(
      rawEntries.map(async (entry: any) => {
        return format(entry, data.boxID, data.boxName);
      })
    );

    // Delete the temporary file.
    fs.unlinkSync(pagePath);

    // Return the entries.
    resolve(parsedEntries);
  });
}

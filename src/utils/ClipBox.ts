import { GQLClipBox } from "../graphql/GQLClipBox"
import { join } from "path"
import { BoundingBox } from "../graphql/BoundingBox"
import {
    fetchReadStream,
    pipe,
    clip,
} from "../utils/Promises";
import * as fs from "fs";

const BOX_FOLDER_ID = process.env.BOXFOLDER + "";

export async function clipBox(
    data: GQLClipBox
): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const pagePath = join("src", "temp", "pages", data.boxID + ".jpg");
        const wstream = fs.createWriteStream(pagePath);
        const rstream = await fetchReadStream(data.boxID);

        if (rstream === undefined) {
            reject(`Could not fetch file with id ${data.boxID}`);
        }

        await pipe(rstream, wstream);

        let sfx = 0;
        await Promise.all(
            data.boundingBoxes.map((box: BoundingBox) => {
                try {
                    const entryName = data.boxID + "-" + sfx;
                    sfx += 1;
                    return clip(
                        pagePath,
                        entryName,
                        BOX_FOLDER_ID,
                        box.left,
                        box.width,
                        box.top,
                        box.height
                    );
                } catch (err) {
                    reject(err);
                    return null;
                }
            })
        );
        fs.unlinkSync(pagePath);
        resolve("success.");
    })
}
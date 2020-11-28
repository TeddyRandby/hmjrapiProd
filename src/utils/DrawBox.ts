let PImage = require('pureimage');
import { join } from "path"
import { createWriteStream, createReadStream } from "fs"
import { fetchReadStream, uploadFile, getParentID } from "./Promises";
import { GQLExplodeEntries } from "../graphql/GQLExplodeEntries";

export function drawBox(data: GQLExplodeEntries): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const rstream = await fetchReadStream(data.boxID);

            if (rstream === undefined) {
                reject(`Could not fetch file with id ${data.boxID}`);
            }

            PImage.decodeJPEGFromStream(rstream).then((img: any) => {
                let ctx = img.getContext('2d');
                ctx.strokeStyle = '#00ff00';
                ctx.lineWidth = 10;
                for (let box of data.boundingBoxes) {
                    ctx.drawLine({ start: { x: box.left, y: box.top }, end: { x: box.left + box.width, y: box.top } });
                    ctx.drawLine({ start: { x: box.left, y: box.top }, end: { x: box.left, y: box.top + box.height } });
                    ctx.drawLine({ start: { x: box.left + box.width, y: box.top + box.height }, end: { x: box.left, y: box.top + box.height } });
                    ctx.drawLine({ start: { x: box.left + box.width, y: box.top + box.height }, end: { x: box.left + box.width, y: box.top } });
                }
                const pagePath = join("src", "temp", "pages", data.boxID + ".jpg");
                PImage.encodeJPEGToStream(img, createWriteStream(pagePath)).then(async () => {
                    const folderID = await getParentID(data.boxID);
                    const name = data.boxName.slice(0, data.boxName.length - 4) + "_drawn.jpg";
                    await uploadFile(folderID, name, createReadStream(pagePath))
                    resolve("success");
                }).catch((err: any) => {
                    reject(err);
                })
            })
        } catch (err) {
            reject(err);
        }
    })
}
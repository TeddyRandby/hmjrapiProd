import { BoundingBox } from "../graphql/BoundingBox";
import { cloudPredict } from "./Promises";

export async function cloudExplodeBoxes(data: string): Promise<BoundingBox[]> {
  return new Promise(async function (resolve, reject) {
    const prediction = await cloudPredict(data);
    if (prediction.payload == null || prediction.payload === undefined) {
      reject("failed to predict");
    } else {
      let boxes: BoundingBox[] = [];
      prediction.payload.forEach((item) => {
        if (item.imageObjectDetection != undefined) {
          if (item.imageObjectDetection.boundingBox != undefined) {
            if (
              item.imageObjectDetection.boundingBox.normalizedVertices !=
              undefined
            ) {
              let points =
                item.imageObjectDetection.boundingBox.normalizedVertices;
              points.sort((a, b) => {
                if (
                  a.x == undefined ||
                  a.y == undefined ||
                  b.x == undefined ||
                  b.y == undefined
                ) {
                  return 0;
                }
                if (a.y < b.y) {
                  return -1;
                } else if (a.y == b.y) {
                  if (a.x < b.x) {
                    return -1;
                  } else if (a.x == b.x) {
                    return 0;
                  } else {
                    return 1;
                  }
                } else {
                  return 1;
                }
              });
              let top: number = 0;
              let left: number = 0;
              let width: number = 0;
              let height: number = 0;
              if (points[0].y) {
                top = points[0].y;
              }
              if (points[0].x) {
                left = points[0].x;
              }
              if (points[0].x && points[1].x) {
                width = points[1].x - points[0].x;
              }
              if (points[0].y && points[1].y) {
                height = points[1].y - points[0].y;
              }
              let box: BoundingBox = {
                top: top,
                left: left,
                width: width,
                height: height,
              };
              boxes.push(box);
            }
          }
        }
      });

      if (boxes.length < 1) {
        reject("no boxes");
      }
      resolve(boxes);
    }
  });
}

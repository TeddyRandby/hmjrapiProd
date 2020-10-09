import {
  launch,
  startTFModel,
  decodeImage,
  getPredictor,
} from "../utils/Promises";
import { ObjectDetectionModel, PredictedObject } from "@tensorflow/tfjs-automl";
import { Tensor } from "@tensorflow/tfjs-node";
import { explodeBoxes } from "../utils/ExplodeBoxes";

test("Load the TF AutoML Edge model.", async () => {
  await launch().catch((err: any) => console.log(err));
  const model = await startTFModel();
  return expect(model).toBeInstanceOf(ObjectDetectionModel);
});

test("Decode an image.", async () => {
  const decodedImage = await decodeImage("src/temp/test.jpg");
  return expect(decodedImage).toBeInstanceOf(Tensor);
});

test("Get a predictor for TF AutoML Edge model.", async () => {
  const predictor = await getPredictor();
  return expect(predictor).toBeDefined();
});

test("Make a prediction with getPredictor with the TF AutoML Edge model.", async () => {
  const predictor = await getPredictor();
  const prediction: PredictedObject[] = await predictor(
    "C://Users/tedra/source/repos/hmjrAPI/src/temp/test.jpg"
  );
  prediction.forEach((data: any) => {
    console.log(data);
  });
  return expect(prediction).toBeDefined();
});

test("Use the explodeBoxes function to make a prediction.", async () => {
  const data = await explodeBoxes("682644333162");
  console.log(data);
  return expect(data).toBeDefined();
});

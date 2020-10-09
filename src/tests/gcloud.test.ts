import { cloudExplodeBoxes } from "../utils/CloudExplodeBoxes";
//import { cloudPredict } from "../utils/Promises";

test("Explode a page using the cloud.", async () => {
  jest.setTimeout(30000);
  const result = await cloudExplodeBoxes("682644629967").catch((error: any) => console.log(error));
  console.log(result);
  return true;
});

// test("Predict a page using the cloud.", async () => {
//   jest.setTimeout(30000);
//   const result = await cloudPredict("682644629967");
//   console.log(result);
//   return true;
// });

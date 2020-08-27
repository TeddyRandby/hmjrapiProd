import { format } from "../utils/Promises";
import { PSMEntry } from "../psm/predictionPSM";
test("Save a file with TypeORM", async () => {
  const entry: PSMEntry = {
    header: ["Roads, Public"],
    content: [
      "See Unemployment Roosevelt, Eleanor",
      " Kiplinger expresses ",
      'die Schults ("Dutch") ',
    ],
    indexes: [{ pointer: 0, stringified: "1", content: "" }],
    dates: [{ pointer: 0, stringified: "1/2/3", content: "" }],
    entities: [{ name: "temp" }],
  };
  const boxID = "testid";
  const boxName = "001_test-name.jpg";
  const result = await format(entry, boxID, boxName).catch((err: any) => {
    throw err;
  });
  console.log(result);
  if (result !== undefined) {
    return true;
  } else {
    return false;
  }
});

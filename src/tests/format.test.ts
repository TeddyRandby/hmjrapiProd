import { format } from "../utils/Promises";

test('Save a file with TypeORM', async () => {
    const entry = {
        header: [ 'Roads, Public' ],
        content: [
          'See Unemployment Roosevelt, Eleanor',
          ' Kiplinger expresses ',
          'die Schults ("Dutch") '
        ],
        pages: [{'1':0}],
        dates: [{'1/2/3':0},{'2/3/4':1}, {'07/3/3':2}]
      };
    const boxID = "testid";
    const boxName = "001_test-name.jpg"
    const result = await format(entry,boxID, boxName).catch((err:any)=>{throw err});
    console.log(result)
    if (result !== undefined) {
        return true
    } else {
        return false
    }
});
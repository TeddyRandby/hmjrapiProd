import { pipe, fetchReadStream } from "../utils/Promises";
import { createWriteStream, readFileSync } from 'fs';


test('Pipe a read stream into a write stream. ', async () => {
    const rstream = await fetchReadStream('682644629967')
    const wstream = createWriteStream('./src/temp/test.jpg', {flags:'w'})
    const status = await pipe(rstream, wstream)
    if (status !== 'Success') {
        return false;
    } else {
        try {
            readFileSync('./src/temp/test', { flag: 'r' })
            return true;
        } catch (err) {
            return false;
        }
    }
});
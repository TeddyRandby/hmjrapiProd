import { fetchReadStream } from "../utils/Promises";
import { ReadStream } from 'fs';


test('Fetch a read stream from BOX.', async () => {
    const rstream = await fetchReadStream('682644629967')
    return rstream as ReadStream
});
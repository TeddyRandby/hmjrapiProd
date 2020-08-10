import { uploadFile } from "../utils/Promises";
import {createReadStream} from 'fs'

test('Upload a file to BOX.', async () => {
    jest.setTimeout(15000)
    const rstream = createReadStream('./src/temp/test.jpg', {flags:'r'})
    await uploadFile('117343777715','test',rstream).catch((err:any)=>{
        expect(err.statusCode).toBe(409);
    })
});
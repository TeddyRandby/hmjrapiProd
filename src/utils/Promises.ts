import * as fs from "fs";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { EntryResolver } from "../resolvers/EntryResolver"; // add this
import {createConnection, ConnectionOptions } from "typeorm";
import {config} from "dotenv"
const boxClient = require("./Box");

export function launch(): Promise<String> {
  return new Promise(async function (resolve, reject) {
    try {

      config();
      
      let connectionOptions:ConnectionOptions = {
        "type": "mongodb",
        "database": "test",
        "logging": false,
        "url": process.env.DATABASE_URL,
        "useUnifiedTopology": true,
        "entities": [process.env.NODE_ENV =="dev" ? "src/models/**/*.ts":"dist/models/**/*.js"],
        "migrations": [__dirname + "../migration/**/*{.ts,.js}"],
        "subscribers": [__dirname + "../subscriber/**/*{.ts,.js}"],
        "cli": {
          "entitiesDir": "src/entity",
          "migrationsDir": "src/migration",
          "subscribersDir": "src/subscriber"
        }
      };

      await createConnection(connectionOptions).catch(reject);
      const schema = await buildSchema({
        resolvers: [EntryResolver],
        validate: false,
      }).catch(reject);
      if (schema !== undefined) {
        const server = new ApolloServer({ schema });
        await server.listen(process.env.PORT);
        resolve("Server has launched!");
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

export function readFile(file: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err: any, buff: Buffer) => {
      if (err) reject(err)
      resolve(buff)
    })

  })
}

export function getVolumeDownloadURL(vol: string): Promise<any> {
	return new Promise((resolve, reject) => {
		boxClient.default.folders.getItems('116338627657', { offset: parseInt(vol), limit:50, fields: 'name, id'}).then((items:any)=>{
			if(!items)
				reject("No volume")
			let val = items.entries.filter((item:any)=>(item.name == `V${vol}`));
			if (!val || !val[0])
				reject('No items with matching volume')
			boxClient.default.folders.getItems(val[0].id, {fields: 'name, id'}).then((subitems:any)=>{
				if(!subitems)
					reject("Volume has No items")
				let val = subitems.entries.filter((item:any)=>(item.name == `Data`));
				if (!val || !val[0])
					reject('No data in volume')
				boxClient.default.folders.getItems(val[0].id, {fields: 'name, id'}).then((subsubitems:any)=>{
					if(!subsubitems)
						reject("Volume Data has No items")
					let val = subsubitems.entries
					if (!val || !val[0])
						reject('Volume data has no pdf')
					resolve(fetchDownloadURL(val[0].id))
				})
			})
		})
	})
}

// Fetch a file's read stream from BOX API.
export function fetchReadStream(boxFileID: String): Promise<fs.ReadStream> {
  return new Promise(function (resolve, reject) {
    boxClient.default.files.getReadStream(boxFileID, null, function (
      error: any,
      stream: fs.ReadStream
    ) {
      if (error) {
        reject(error);
      } else {
        resolve(stream);
      }
    });
  });
}

// Fetch a file's download URL from BOX API.
export function fetchDownloadURL(boxFileID: String): Promise<string> {
  return new Promise(function (resolve, reject) {
    boxClient.default.files
      .getDownloadURL(boxFileID)
      .then((url: string) => {
        resolve(url);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}

// Pipe a read stream into a write stream.
export function pipe(
  rstream: fs.ReadStream,
  wstream: fs.WriteStream
): Promise<String> {
  return new Promise(function (resolve, reject) {
    rstream.on("end", () => {
      resolve("Success");
    });
    rstream.on("error", reject);
    rstream.pipe(wstream);
  });
}

// Upload a file to BOX API.
export function uploadFile(
  boxFolderID: String,
  name: String,
  stream: fs.ReadStream
): Promise<any> {
  return new Promise(function (resolve, reject) {
    boxClient.default.files
      .uploadFile(boxFolderID, name, stream)
      .then((file: any) => resolve(file))
      .catch(reject);
  });
}

export function getParentID(fileID: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      boxClient.default.files.get(fileID).then((file: any) => {
        resolve(file.parent.id);
      })
    } catch (err) {
      reject(err);
    }
  })
}

export function getFileName(fileID: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      boxClient.default.files.get(fileID).then((file: any) => {
        resolve(file.name.substring(0, file.name.length - 4));
      })
    } catch (err) {
      reject(err);
    }
  })
}

export function makeEntrySubFolder(fileID: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const parent = await getParentID(fileID);
      const imageName = await getFileName(fileID);
      boxClient.default.folders.create(parent, imageName + "_entries").then((folder: any) => {
        resolve(folder.id)
      }).catch(reject);
    } catch (err) {
      reject(err);
    }
  })

}




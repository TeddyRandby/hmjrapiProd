"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEntrySubFolder = exports.getFileName = exports.getParentID = exports.uploadFile = exports.pipe = exports.fetchDownloadURL = exports.fetchReadStream = exports.readFile = exports.launch = void 0;
const fs = require("fs");
const apollo_server_1 = require("apollo-server");
const type_graphql_1 = require("type-graphql");
const EntryResolver_1 = require("../resolvers/EntryResolver");
const typeorm_1 = require("typeorm");
const boxClient = require("./Box");
function launch() {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let connectionOptions = {
                    "type": "mongodb",
                    "database": "test",
                    "logging": false,
                    "url": process.env.DATABASE_URL,
                    "useUnifiedTopology": true,
                    "entities": [__dirname + "src/models/**/*.ts", __dirname + "models/**/*.js"],
                    "migrations": [__dirname + "src/migration/**/*.ts", __dirname + "dist/migration/**/*.js"],
                    "subscribers": [__dirname + "src/subscriber/**/*.ts", __dirname + "dist/subscriber/**/*.js"],
                    "cli": {
                        "entitiesDir": "src/entity",
                        "migrationsDir": "src/migration",
                        "subscribersDir": "src/subscriber"
                    }
                };
                yield typeorm_1.createConnection(connectionOptions).catch(reject);
                const schema = yield type_graphql_1.buildSchema({
                    resolvers: [EntryResolver_1.EntryResolver],
                    validate: false,
                }).catch(reject);
                if (schema !== undefined) {
                    const server = new apollo_server_1.ApolloServer({ schema });
                    yield server.listen(process.env.PORT || 4000);
                    resolve("Server has launched!");
                }
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    });
}
exports.launch = launch;
function readFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, buff) => {
            if (err)
                reject(err);
            resolve(buff);
        });
    });
}
exports.readFile = readFile;
function fetchReadStream(boxFileID) {
    return new Promise(function (resolve, reject) {
        boxClient.default.files.getReadStream(boxFileID, null, function (error, stream) {
            if (error) {
                reject(error);
            }
            else {
                resolve(stream);
            }
        });
    });
}
exports.fetchReadStream = fetchReadStream;
function fetchDownloadURL(boxFileID) {
    return new Promise(function (resolve, reject) {
        boxClient.default.files
            .getDownloadURL(boxFileID)
            .then((url) => {
            resolve(url);
        })
            .catch((err) => {
            reject(err);
        });
    });
}
exports.fetchDownloadURL = fetchDownloadURL;
function pipe(rstream, wstream) {
    return new Promise(function (resolve, reject) {
        rstream.on("end", () => {
            resolve("Success");
        });
        rstream.on("error", reject);
        rstream.pipe(wstream);
    });
}
exports.pipe = pipe;
function uploadFile(boxFolderID, name, stream) {
    return new Promise(function (resolve, reject) {
        boxClient.default.files
            .uploadFile(boxFolderID, name, stream)
            .then((file) => resolve(file))
            .catch(reject);
    });
}
exports.uploadFile = uploadFile;
function getParentID(fileID) {
    return new Promise((resolve, reject) => {
        try {
            boxClient.default.files.get(fileID).then((file) => {
                resolve(file.parent.id);
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.getParentID = getParentID;
function getFileName(fileID) {
    return new Promise((resolve, reject) => {
        try {
            boxClient.default.files.get(fileID).then((file) => {
                resolve(file.name.substring(0, file.name.length - 4));
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.getFileName = getFileName;
function makeEntrySubFolder(fileID) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const parent = yield getParentID(fileID);
            const imageName = yield getFileName(fileID);
            boxClient.default.folders.create(parent, imageName + "_entries").then((folder) => {
                resolve(folder.id);
            }).catch(reject);
        }
        catch (err) {
            reject(err);
        }
    }));
}
exports.makeEntrySubFolder = makeEntrySubFolder;
//# sourceMappingURL=Promises.js.map
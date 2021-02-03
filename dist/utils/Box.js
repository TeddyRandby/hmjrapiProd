"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BoxSDK = require("box-node-sdk");
let sdkConfig = process.env.BOX_CONFIG || require("../../boxconfig.json");
console.log(sdkConfig);
let sdk = BoxSDK.getPreconfiguredInstance(sdkConfig);
const boxClient = sdk.getAppAuthClient("enterprise");
exports.default = boxClient;
//# sourceMappingURL=Box.js.map
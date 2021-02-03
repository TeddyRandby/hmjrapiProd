"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BoxSDK = require("box-node-sdk");
let sdkConfig;
if (process.env.BOX_CONFIG)
    sdkConfig = JSON.parse(process.env.BOX_CONFIG);
if (!process.env.BOX_CONFIG)
    sdkConfig = require("../../boxconfig.json");
let sdk = BoxSDK.getPreconfiguredInstance(sdkConfig);
const boxClient = sdk.getAppAuthClient("enterprise");
exports.default = boxClient;
//# sourceMappingURL=Box.js.map
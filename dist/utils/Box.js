"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BoxSDK = require("box-node-sdk");
var sdkConfig = require("../../boxconfig.json");
var sdk = BoxSDK.getPreconfiguredInstance(sdkConfig);
const boxClient = sdk.getAppAuthClient("enterprise");
exports.default = boxClient;
//# sourceMappingURL=Box.js.map
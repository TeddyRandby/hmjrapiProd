const BoxSDK = require("box-node-sdk");
// Init Box connection
let sdkConfig;
if (process.env.BOX_CONFIG)
  sdkConfig = JSON.parse(process.env.BOX_CONFIG)

if (!process.env.BOX_CONFIG)
  sdkConfig = require("../../boxconfig.json");

let sdk = BoxSDK.getPreconfiguredInstance(sdkConfig);
const boxClient = sdk.getAppAuthClient("enterprise");
export default boxClient;


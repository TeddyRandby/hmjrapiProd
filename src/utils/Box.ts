const BoxSDK = require("box-node-sdk");
// Init Box connection
let sdkConfig = process.env.BOX_CONFIG || require("../../boxconfig.json");
console.log(sdkConfig)
let sdk = BoxSDK.getPreconfiguredInstance(sdkConfig);
const boxClient = sdk.getAppAuthClient("enterprise");
export default boxClient;


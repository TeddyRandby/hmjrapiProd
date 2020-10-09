const BoxSDK = require("box-node-sdk");
// Init Box connection
var sdkConfig = require("../../boxconfig.json");
var sdk = BoxSDK.getPreconfiguredInstance(sdkConfig);
const boxClient = sdk.getAppAuthClient("enterprise");
export default boxClient;


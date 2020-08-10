const BoxSDK = require('box-node-sdk');
// Init Box connection
var sdkConfig = require('../../boxconfig.json');
var sdk = BoxSDK.getPreconfiguredInstance(sdkConfig);
const client = sdk.getAppAuthClient('enterprise');
export default client;
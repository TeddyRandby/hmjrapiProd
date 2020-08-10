import { launch } from "../utils/Promises";
// import { request } from 'graphql-request'

// const query = `{

// }`

test('Launch the server.', async () => {
  const status = await launch();
  return status === 'Server has launched!'
  // const response = await request("http://[::1]:4000/",query);
  // return response.data.entries === [];
});
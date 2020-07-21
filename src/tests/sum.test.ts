import { createTypeormConnection } from "../util/createTypeormConnection";
import { request } from 'graphql-request'
 
const query = `{
  Movie(title: "Inception") {
    releaseDate
    actors {
      name
    }
  }
}`

test('adds 1 + 2 to equal 3', async () => {
  await createTypeormConnection();

  });
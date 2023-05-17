import { MongoClient } from "mongodb";
let db;

async function connectToDb(callBack) {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  await client.connect();

  db = client.db('react-blog-dbs');
  callBack();
}

export {
  db,
  connectToDb
}
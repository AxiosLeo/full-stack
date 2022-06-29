/**
 * https://github.com/mongodb/node-mongodb-native
 */
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
const options: MongoClientOptions = {};
const url = process.env.MONGODB_URL || '';

export let client: MongoClient;
export let db: Db;

export const initialize = () => {
  client = new MongoClient(url, options);
  client.connect();
  db = client.db('factory-cloud');
};

import mysql from 'mysql'; // https://github.com/mysqljs/mysql
import redis from 'redis'; // https://www.npmjs.com/package/redis
import { MongoClient, MongoClientOptions } from 'mongodb'; // https://github.com/mongodb/node-mongodb-native
import { debug } from '@axiosleo/cli-tool'

const connectors: Record<string, any> = {};

export const initialize = (dbconfigs: Array<Record<string, any>>): void => {
  dbconfigs.forEach((dbconfig) => {
    const name: string = dbconfig.name as string;
    const type = dbconfig.type;
    let config;
    switch (type) {
      case 'mysql':
        config = dbconfig.options as mysql.ConnectionConfig;
        connectors[name] = mysql.createConnection(config);
        connectors[name].connect();
        break;
      case 'redis':
        config = dbconfig.options as redis.ClientOpts;
        connectors[name] = redis.createClient(config);
        break;
      case 'mongodb':
        const url = dbconfig.url;
        config = dbconfig.options as MongoClientOptions;
        connectors[name] = new MongoClient(url, config);
        break;
    }
  });
}

export function connect<T>(name: string): T {
  if (!connectors[name]) {
    debug.stack(`Please initialize "${name}" connector`,);
  }
  const connector: T = connectors[name];
  return connector;
}

export function connectMysql(name: string = 'db.mysql'): mysql.Connection {
  const connector: mysql.Connection = connect<mysql.Connection>(name);
  return connector;
}

export function connectRedis(name: string = 'db.redis'): redis.RedisClient {
  const connector: redis.RedisClient = connect<redis.RedisClient>(name);
  return connector;
}

export function connectMongo(name: string = 'db.mongo'): MongoClient {
  const connector: MongoClient = connect<MongoClient>(name);
  return connector;
}
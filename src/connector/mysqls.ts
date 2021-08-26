// https://github.com/mysqljs/mysql
import mysql from 'mysql';

const clients: { [k: string]: mysql.Connection } = {};

const getClient = (name: string): mysql.Connection => {
  if (!clients[name]) {
    throw new Error(`MySQL Client ${name} not exist`);
  }
  return clients[name];
};

export const initClient = (name: string, options: mysql.ConnectionConfig): void => {
  clients[name] = mysql.createConnection(options);
};

export default getClient;

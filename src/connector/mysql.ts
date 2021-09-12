// https://github.com/mysqljs/mysql
import mysql from 'mysql';
import config from '../config';

const clients: { [k: string]: mysql.Connection } = {};

if (config.has('db.mysql')) {
  clients['default'] = mysql.createConnection(config.get('db.mysql'));
}

export default clients['default'];

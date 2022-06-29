import { Connection, ConnectionOptions, createConnection } from 'mysql2';
export * from 'mysql2';
import { printer } from '@axiosleo/cli-tool';
import { mysql } from '.';

type Clients = {
  [key: string]: Connection
}

const clients: Clients = {
  // main: undefined,
};

export const initialize = (): void => {
  const options: ConnectionOptions = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS || 'password',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    database: process.env.MYSQL_DB_MAIN || 'main_db',
  };
  clients.main = createConnection(options);
  clients.main.connect();
};

export const mainDB = (): Connection => {
  return clients.main!;
};

export const businessDB = (companyCode: string): Connection => {
  const key = `business_${companyCode}`;
  if (!clients[key]) {
    const options: ConnectionOptions = {
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASS || 'password',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      database: key,
    };
    clients[key] = createConnection(options);
    clients[key].connect((err) => {
      if (!err) {
        printer.warning(`Connected to ${key} successfully`);
      } else {
        printer.error(`Failed to connect ${key}`);
      }
    });
  }
  return clients[key]!;
};

export const removeDB = (companyCode: string) => {
  const key = `business_${companyCode}`;
  if (clients[key]) {
    delete clients[key];
  }
};

export const query = async (conn: mysql.Connection, options: mysql.QueryOptions): Promise<any> => {
  return new Promise((resolve, reject) => {
    conn.query(options, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export class QueryHandler {
  conn: mysql.Connection;

  constructor(conn: mysql.Connection) {
    this.conn = conn;
  }

  async query(options: mysql.QueryOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conn.query(options, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async select(table: string, condition: any | null = null, attrs: string[] | string = '*') {
    const fields = Array.isArray(attrs) ? attrs.join(',') : attrs;
    let sql = `SELECT ${fields} FROM ${table}`;
    const values: any[] = [];
    if (condition !== null) {
      sql += ` WHERE ${Object.keys(condition).map((c) => {
        values.push(condition[c]);
        return `\`${c}\` = ?`;
      }).join(' AND ')}`;
    }
    return await this.query({
      sql, values
    });
  }

  async update(tableName: string, obj: any, condition: any | null = null): Promise<mysql.OkPacket> {
    let sql = `update \`${tableName}\` set `;
    const fields: string[] = [];
    const values: any[] = [];
    Object.keys(obj).forEach((key) => {
      if (obj[key] === null) {
        delete obj[key];
        return;
      }
      fields.push(`\`${key}\` = ?`);
      if (obj[key] !== null && typeof obj[key] === 'object' && Array.isArray(obj[key]) === false) {
        values.push(JSON.stringify(obj[key]));
      } else {
        values.push(obj[key]);
      }
    });
    sql += fields.join(',');
    if (condition !== null) {
      sql += ` WHERE ${Object.keys(condition).map((c) => {
        values.push(condition[c]);
        return `\`${c}\` = ?`;
      }).join(' AND ')}`;
    }
    return await this.query({ sql, values });
  }

  async find(tableName: string, condition: any | null = null, attrs: string[] | string = '*'): Promise<any> {
    const [row] = await this.select(tableName, condition, attrs);
    return row;
  }

  async insert(tableName: string, obj: any): Promise<mysql.OkPacket> {
    const fields: string[] = [];
    const values: any[] = [];
    Object.keys(obj).forEach((key) => {
      if (obj[key] === null) {
        delete obj[key];
        return;
      }
      fields.push(`\`${key}\``);
      if (obj[key] !== null && typeof obj[key] === 'object' && Array.isArray(obj[key]) === false) {
        values.push(JSON.stringify(obj[key]));
      } else {
        values.push(obj[key]);
      }
    });
    const sql = `INSERT INTO \`${tableName}\` (${fields.join(',')}) VALUES (${fields.map(() => '?').join(',')})`;
    return await this.query({ sql, values });
  }

}

// https://github.com/mysqljs/mysql
import mysql from 'mysql';

class MysqlConnector {
  clients: { [k: string]: mysql.Connection } = {};
  default: mysql.Connection | undefined;

  newConnection(name: string, dbconfig: string | mysql.ConnectionConfig): mysql.Connection {
    this.clients[name] = mysql.createConnection(dbconfig);
    if (!this.default) {
      this.default = this.clients[name];
    }
    return this.clients[name];
  }

  select(name: string | undefined): mysql.Connection {
    if (!name && this.default) {
      return this.default;
    }
    if (!name) {
      throw new Error('Please initialize Mysql DB connectors');
    }
    return this.clients[name];
  }

  initialize(dbconfig: Record<string, any>) {
    Object.keys(dbconfig).forEach((name: string) => {
      const dbsettings = dbconfig[name];
      switch (dbsettings['type']) {
      case 'mysql':
        this.newConnection(name, dbsettings);
        break;
      default:
        return;
      }
    });
  }
}

export default new MysqlConnector();

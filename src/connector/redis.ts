// https://www.npmjs.com/package/redis
import redis from 'redis';

class RedisConnector {
  clients: { [k: string]: redis.RedisClient } = {};
  default: redis.RedisClient | undefined;

  newConnection(name: string, dbconfig: redis.ClientOpts): redis.RedisClient {
    this.clients[name] = redis.createClient(dbconfig);
    if (!this.default) {
      this.default = this.clients[name];
    }
    return this.clients[name];
  }

  select(name: string | undefined): redis.RedisClient {
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
      case 'redis':
        this.newConnection(name, dbsettings);
        break;
      default:
        return;
      }
    });
  }
}

export default new RedisConnector();

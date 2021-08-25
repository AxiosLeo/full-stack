import redis from 'redis';

const clients: { [k: string]: redis.RedisClient } = {};

const getClient = (name: string): redis.RedisClient => {
  if (!clients[name]) {
    throw new Error(`Redis Client ${name} not exist`);
  }
  return clients[name];
};

export const initClient = (name: string, options?: redis.ClientOpts): void => {
  clients[name] = redis.createClient(name, options);
};

export default getClient;

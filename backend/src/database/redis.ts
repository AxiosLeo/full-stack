// https://github.com/redis/node-redis
import redis, { createClient } from 'redis';

export let redisClient: any;

export const client = () => {
  if (!redisClient) {
    const options: redis.RedisClientOptions = {
      url: `redis://${process.env.REDIS_HOST}:${parseInt(process.env.REDIS_PORT || '6379')}`
    };

    redisClient = createClient(options);
    redisClient.connect();
  }
  return redisClient;
};

export const initialize = () => {
  client();
};

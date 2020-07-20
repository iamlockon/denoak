import { connect, Redis, RedisConnectOptions } from '../../dep.ts';
import { redis } from '../../config.ts'
import { logger } from '../logger/index.ts';

interface RedisConfig {
  host: string;
  port: number;
  maxRetryCount?: number;
};

const buildClient = async (opts?: RedisConfig) => {
  const config: RedisConfig = Object.assign({}, opts);
  try {
    const client = await connect({
      hostname: config.host,
      port: config.port,
      maxRetryCount: config.maxRetryCount || 10
    });
    logger.info(`[Redis] Connected successfully.`);
    return client;
  } catch (err) {
    logger.critical(`[Redis] Failed to connect: ${JSON.stringify(err)}`);
    throw err;
  }
};

class RedisClient {
  client?: Redis
  
  async init(opts?: RedisConfig) {
    if (!this.client) {
      this.client = await buildClient(opts);
    }
  }

  async ping() {
    if (this.client !== null && this.client !== undefined) {
      return this.client.ping();
    }
  }

  async info() {
    if (this.client !== null && this.client !== undefined) {
      return this.client.info();
    }
  }
}

const redisClient = new RedisClient();
await redisClient.init({ ...redis, maxRetryCount: 5 });

export {
  redisClient,
  RedisClient
}
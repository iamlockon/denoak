// A redis queue worker
import { redisClient, RedisClient } from '../redis/index.ts';
import { logger } from '../logger/index.ts';
import { QUEUES } from '../consts/index.ts';
import { CALLBACKS } from './callbacks.ts'


async function sleep(sec: number) {
  return new Promise((res) => {
    setTimeout(() => res(), sec);
  })
}

async function watchQueues(client: RedisClient, queues: string[]) {
  logger.info('[Worker - Redis Queue] Worker started.');
  while (true) {
    await sleep(1000); // wake up in 1-sec interval to check tasks
    const task = await client.client?.blpop(queues, 5);
    logger.debug("task:", task);
    if (!task || task.length < 2) {
      logger.debug('[Worker - Redis Queue]  Queue is empty, go to sleep.');
      continue;
    }
    const [name, ...args] = JSON.parse(task[1] || '[""]');
    if (!Object.keys(CALLBACKS).includes(name)) {
      logger.error(`[Worker - Redis Queue] Unknown callback: ${name}, args: ${args}`);
      continue;
    }
    logger.debug(`[Worker - Redis Queue] start running task : ${name} with args: ${args}`);
    await CALLBACKS[name](...args);
    logger.debug(`[Worker - Redis Queue] Task finished : ${name} with args: ${args}`);
  }
}

async function init(client: RedisClient) {
  if (!client) {
    logger.error(`[Worker - Redis Queue] Redis client not initialized...`);
    return;
  }
  const queues = Object.values(QUEUES);
  await watchQueues(client, queues);
}



await init(redisClient);
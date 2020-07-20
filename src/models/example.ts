import { Schema as T, _string, _Type } from "../../dep.ts";
import { client } from "../db/index.ts";
import { DBError } from "../../utils/index.ts";
import { TYPE, QUEUES } from "../consts/index.ts";
// import errTrace from "./eTrace.ts";
import { redisClient } from '../redis/index.ts'
interface Example {
  description: string;
}

export const addExample = async ({ description }: Example) => {
  try {
    await client.execute(
      `INSERT INTO example (description) VALUES (?);`,
      [description],
    );
  } catch (err) {
    // await errTrace.add(TYPE.DB, err); // Direct add trace

    const pack = ["ADD_ERR_TRACE", TYPE.DB, JSON.stringify({ message: err.message, stack: err.stack})]; // Use task queue
    redisClient.client?.rpush(QUEUES.MID, JSON.stringify(pack));
    throw new DBError();
  }
};

export const exampleValidator = (target: Example) => {
  const validator = ExampleSchema.destruct();
  return validator(target);
};

// Define schema here

const ExampleSchema = T({
  description: _string.trim().normalize(),
});

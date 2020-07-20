import { client } from "../db/index.ts";

const add = async (type: string, error: Error | string) => {
  if (typeof error === 'string') {
    const contents = JSON.parse(error);
    error = new Error(contents.message);
    error.stack = contents.stack;
  }
  await client.execute(
    `
    INSERT INTO error_trace (type, content, stack) VALUES (?, ?, ?)
    ;`,
    [type, error.message, error.stack],
  );
};

export default {
  add,
};

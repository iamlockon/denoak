import { client } from "../db/index.ts";

const add = async (type: string, error: Error) => {
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

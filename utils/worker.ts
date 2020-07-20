import { logger } from "../src/logger/index.ts";

const startWorker = async (filename: string) => {
  const worker = await Deno.run({
    cmd: [
      "deno",
      "run",
      "--allow-all", // WARNING: just for convenience.
      filename
    ],
  });
}

export const startWorkers = () => {
  const dirpath = new URL("../src/workers", import.meta.url);
  const files = Deno.readDirSync(dirpath.pathname);
  for (const { name } of files) {
    startWorker(`${dirpath.pathname}/${name}`);
  }
}
import { Client } from "../../dep.ts";
import { db } from "../../config.ts";
import { logger } from "../logger/index.ts";

export async function clientBuilder(opts?: object) {
  const config = Object.assign({}, db, opts);
  const client = await new Client().connect({
    hostname: config.host,
    username: config.user,
    db: config.dbname,
    poolSize: config.poolSize || 3, // default to 3 connections
    password: config.password,
  });

  return client;
}

export async function checkAndUpdateDB() {
  try {
    const res = await client.execute(
      `SELECT 1 FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${db.dbname}';`,
    );
  } catch (err) {
    if (err.message.includes("Unknown database")) {
      throw new Error(`${db.dbname} not created yet, please create it first.`);
    }
    throw new Error(`Error while checking db: ${err.message}`);
  }
  const tableRes = await client.execute(`SHOW TABLES LIKE 'version'`);
  if (tableRes === undefined || tableRes.rows === undefined) {
    throw new Error("Check `version` table failed...");
  }
  if (tableRes.rows !== undefined && tableRes.rows.length === 0) {
    await updateDB(true);
  } else await updateDB();
}
/**
 * 
 * @param isInit boolean
 */
async function updateDB(isInit: boolean = false) {
  if (isInit) {
    // init version table
    logger.info("No patches detected, starting db init....");
    await client.execute(`DROP TABLE IF EXISTS version;`);
    await client.execute(`
    CREATE TABLE IF NOT EXISTS version (
      id serial,
      version int UNSIGNED NOT NULL,
      created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `);
    logger.debug("db init finished...");
  }
  // run patches
  const res = await client.execute(
    "SELECT MAX(version) as maxver FROM version;",
  );
  let curVer = res.rows?.[0].maxver + 1 || 1;
  logger.info(`Current patch version: ${curVer - 1}`);
  const dirpath = new URL("./patches", import.meta.url);
  const files = Deno.readDirSync(dirpath.pathname);
  for (const { name } of files) {
    if (name[0] < curVer) continue;
    const sql = await Deno.readTextFileSync(`${dirpath.pathname}/${name}`);
    // deno-mysql not support multiple statements yet.
    const sqlStatements = sql.trim().split(";");
    logger.info(`Patching version ${curVer}...`);
    // transaction
    await client.transaction(async (conn) => {
      for (const statement of sqlStatements) {
        if (statement === "") continue;
        await conn.execute(statement + ";");
      }
      return await conn.execute(
        `
      INSERT INTO version (version) VALUES (?)
      ;`,
        [curVer++],
      );
    });
  }
  logger.info("DB is now up-to-date.");
}
let client = await clientBuilder();

export {
  client,
};

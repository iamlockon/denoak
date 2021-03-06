import { Application, isHttpError, Status, oakCors } from "./dep.ts";
import { server, db } from "./config.ts";
import { routerRoutesAllowed } from "./src/services/index.ts";
import { logger } from "./src/logger/index.ts";
import { checkAndUpdateDB } from "./src/db/index.ts";
import { redisClient } from './src/redis/index.ts';
import { isValidationError, isDBError, startWorkers } from "./utils/index.ts";

const app = new Application();

// Error Handling Middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      switch (err.status) {
        case Status.NotFound:
          ctx.response.status = Status.NotFound;
          break;
        case Status.InternalServerError:
          ctx.response.status = Status.InternalServerError;
          ctx.response.body =
            "Sorry, but the server is currently not available...";
          break;
        default:
          ctx.response.status = Status.Teapot; // default case
      }
    } else if (isValidationError(err)) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = err.message;
    } else if (isDBError(err)) {
      ctx.response.status = Status.InternalServerError;
      ctx.response.body = err.message;
    } else {
      logger.critical(`Unknown error encountered: ${JSON.stringify(err)}`);
      ctx.response.status = Status.InternalServerError;
    }
  }
});

// CORS

app.use(oakCors());

// Register all routes here
for (const [route, allowed] of routerRoutesAllowed) {
  app.use(route);
  app.use(allowed);
}

app.addEventListener("listen", ({ hostname, port, secure }) => {
  logger.info(
    `Server started at port ${hostname ?? "localhost"}:${port} successfully`,
  );
  hostname = hostname || "localhost";
  Deno.env.set("SERVER_HOSTNAME", hostname);
  Deno.env.set("SERVER_PORT", port.toString());
});

const controller = new AbortController();
const { signal } = controller;

if (Deno.env.get("ENV") !== "TEST") {
  await checkAndUpdateDB();
  logger.info(`[Redis] PING: ${await redisClient.ping()}`);
  // start Workers asynchronously
  startWorkers();
  await app.listen({ port: server.port, signal });
}

export {
  app,
  controller,
};

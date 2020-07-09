import { Application, isHttpError, Status, HttpError } from "./dep.ts";
import { config } from "./config.ts";
import { routerRoutes, allowedMethods } from "./src/services/index.ts";
import { logger } from "./src/logger/index.ts";

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
          ctx.response.body = 'Sorry, but the server is currently not available...';
          break;
        default:
          ctx.response.status = Status.Teapot; // default case
      }
    } else {
      logger.critical(`Unknown error encountered: ${JSON.stringify(err)}`);
    }
  }
});

app.use(routerRoutes);
app.use(allowedMethods);

app.addEventListener("listen", ({ hostname, port, secure }) => {
  logger.info(
    `Server started at port ${hostname ?? "localhost"}:${port} successfully`,
  );
});

await app.listen({ port: config.server.port });

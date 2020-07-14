import { Router } from "../../dep.ts";
import example from "./example.ts";
const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "Hello, this is a simple Deno REST API Service";
});

router.get("/health", (ctx) => {
  ctx.response.body = {
    healthy: true
  }
});

const rootRoutes = router.routes();
const rootAllowed = router.allowedMethods();
const root = [
  rootRoutes,
  rootAllowed,
];
// All routes go here
const routerRoutesAllowed = [
  root,
  example,
];

export {
  routerRoutesAllowed,
};

import { Router } from "../../dep.ts";

const router = new Router();
router.get("/example", (ctx) => {
  ctx.response.body = "This is Example route.";
});

const exampleRoutes = router.routes();
const exampleAllowed = router.allowedMethods();

const example = [
  exampleRoutes,
  exampleAllowed,
];

export default example;

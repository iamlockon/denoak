import { Router } from "../../dep.ts";
import { addExample, exampleValidator } from "../models/example.ts";
import { ValidationError, bodyParser } from "../../utils/index.ts";

const router = new Router();
router.get("/example", (ctx) => {
  ctx.response.body = "This is Example route.";
});

router.post("/example", async (ctx) => {
  const body = await bodyParser(ctx);
  const [err, example] = exampleValidator(body);
  if (err) throw new ValidationError(err.message);
  if (!example) throw new Error("Cannot add empty example.");
  await addExample(example);
  ctx.response.status = 200;
});

const exampleRoutes = router.routes();
const exampleAllowed = router.allowedMethods();

const example = [
  exampleRoutes,
  exampleAllowed,
];

export default example;

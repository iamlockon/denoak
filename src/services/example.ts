import { Router } from "../../dep.ts";
import { client } from '../db/index.ts';
import { Schema as T} from '../../dep.ts'
import { addExample, exampleValidator } from '../models/example.ts';

const router = new Router();
router.get("/example", (ctx) => {
  ctx.response.body = "This is Example route.";
});

router.post("/example", async (ctx) => {
  const [err, v] = exampleValidator(ctx.request.body);
  const res = await addExample(v);
  ctx.response.body = res;
});

const exampleRoutes = router.routes();
const exampleAllowed = router.allowedMethods();

const example = [
  exampleRoutes,
  exampleAllowed,
];

export default example;

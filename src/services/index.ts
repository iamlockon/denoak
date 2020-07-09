import { Router } from '../../dep.ts';
import { exampleRouter } from './example.ts';

const router = new Router();
router.get('/', (ctx) => {
  ctx.response.body = 'Hello, this is a simple Deno REST API Service';
})
// Register routes for subroutes
router.use(exampleRouter);

const routerRoutes = router.routes();
const allowedMethods = router.allowedMethods();
export {
  routerRoutes,
  allowedMethods
};
import { Router } from '../../dep.ts';

const router = new Router();

router.get('/example', (ctx) => {
  ctx.response.body = 'This is Example route.';
});

const exampleRouter = router.routes();

export {
  exampleRouter
};
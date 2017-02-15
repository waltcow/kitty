import Router from 'koa-router';
const router = new Router();

router.get('/me', function (ctx) {
    ctx.body = {module: 'user', name: 'me'};
});

export default router.routes();

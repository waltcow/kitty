import Router from 'koa-router';

const router = new Router({
    prefix: '/comment'
});

router.get('/me', function (ctx) {
    ctx.throw('Error Message', 401);
    //ctx.body = {module: 'comment', name: 'me'};
});

export default router.routes();

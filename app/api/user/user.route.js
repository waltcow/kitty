import Router from 'koa-router';
impo
const router = new Router({
    prefix: '/user'
});

router.get('/me', function (ctx, next) {
    ctx.body = {module: 'user', name: 'me'};
});

router.post('/create', function (ctx, next) {

})


export default router.routes();

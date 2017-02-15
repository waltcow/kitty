/**
 * Created by Administrator on 2017/2/15.
 */
import Router from 'koa-router';

const router = new Router({
    prefix: '/auth'
});

router.get('/me', function (ctx) {
    ctx.body = {module: 'auth', name: 'me'};
});

export default router.routes();

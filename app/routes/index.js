import Router from 'koa-router'
import user from './user'

const router = new Router({
    prefix: '/api/v1'
});

router.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = 'Protected resource, use Authorization header to get access\n';
        } else {
            ctx.status = 400;
            ctx.body = {
                code: error.code,
                message: error.message || error.msg || 'unknown_error',
                error
            };
        }
    }
});

router.use(user);
//router.use(auth);

export default router.routes();

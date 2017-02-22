import Router from 'koa-router';

import user from './api/user';
//import auth from './api/auth';
//import comment from './api/comment';

const router = new Router({
    prefix: '/api/v1'
});

router.use(async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        if (error.status === 401) {
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
//router.use(comment);

export default router.routes();

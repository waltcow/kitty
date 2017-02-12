import Router from 'koa-router';
import {isAuthenticated} from '../controllers/auth';

const router = new Router();

router.get('/me', isAuthenticated, function (ctx, next) {
    ctx.body = {foo: 'bar'};
    next()
});

export default router.routes()

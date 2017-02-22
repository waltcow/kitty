import Router from 'koa-router';
import {User} from '../models';
import validator from 'validator';
import {isLocalAuthenticated} from '../auth'
const router = new Router();


router.post('/user', async ctx => {
    const body = ctx.request.body;
    const email = body.email ? validator.trim(body.email) : '';
    const username = body.username ? validator.trim(body.username) : '';
    const password = body.password ? validator.trim(body.password) : '';
    const re_password = body.re_password ? validator.trim(body.re_password) : '';
    const isNull = [email, username, password, re_password].some(function (ele) { return ele === '' });
    if (isNull) {
        ctx.status = 422;
        ctx.body = { err: '信息不完整', username, email };
        return;
    }
    try {
        const user = await User.create({
            username: body.username,
            password: body.password,
            email: body.email,
        });
        ctx.status = 200;
        ctx.body = {success:true, _id: user._id};
    } catch (err) {
        ctx.throw(err)
    }
});

router.get('/user', isLocalAuthenticated(), async ctx => {
    ctx.body = 'auth success'
});

export default router.routes();

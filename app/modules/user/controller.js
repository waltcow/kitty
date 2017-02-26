import { User } from '../../models'
import validator from 'validator'
import * as _ from 'lodash'
import { logger } from '../../utils/logger'

export async function createUser(ctx) {
    const body = ctx.request.body;
    const email = body.email ? validator.trim(body.email) : '';
    const username = body.username ? validator.trim(body.username) : '';
    const password = body.password ? validator.trim(body.password) : '';
    const re_password = body.re_password ? validator.trim(body.re_password) : '';
    const isNull = [email, username, password, re_password].some((ele) => { return ele === '' });
    if (isNull) {
        ctx.status = 422;
        ctx.body = { message: '信息不完整' };
        return;
    }
    try {
        const user = await User.create({
            username: body.username,
            password: body.password,
            email: body.email,
        });
        ctx.body = {
            user: user.toJSON(),
            token: user.generateToken()
        }
    } catch (err) {
        ctx.throw(422, err.message)
    }
}

export async function getUsers(ctx) {
    const users = await User.find({});
    ctx.body = { users }
}

export async function getUser(ctx, next) {
    try {
        const user = await User.findById(ctx.params.id);
        if (!user) {
            ctx.throw(404)
        }
        ctx.body = { user: user.toJSON() }
    } catch (err) {
        if (err === 404 || err.name === 'CastError') {
            ctx.throw(404)
        }
        ctx.throw(500)
    }

    if (next) { return next() }
}

export async function updateUser(ctx) {
    const userId = ctx.params.id;
    const pickedObj = _.pick(ctx.request.body, ['username', 'email', 'role']);
    const updateObj = _.omitBy(pickedObj, (val) => { return _.isUndefined(val) || _.isNull(val) });
    try {
        const user = await User.findById(userId);
        Object.assign(user, updateObj);
        ctx.body = await user.save();
    } catch (err) {
        logger.error(err, 'update user info error');
        ctx.throw(422, 'update user info error');
    }
}

export async function deleteUser(ctx) {
    const currentUserId = ctx.req.user._id;
    const deleteUserId = ctx.params.id;
    if (currentUserId == deleteUserId) {
        ctx.status = 403;
        ctx.body = { message: '不能删除自己已经登录的账号' };
    } else {
        try {
            const user = await User.findByIdAndRemove(deleteUserId);
            logger.info(`uid: ${currentUserId} 删除用户 ${user.username}`);
            ctx.status = 200;
            ctx.body = { code: 'OK', id: user.id };
        } catch(err) {
            logger.error(err, '删除用户失败');
            ctx.throw(err);
        }
    }
}

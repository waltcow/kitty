import { User } from '../../models'
import validator from 'validator'

export async function createUser (ctx) {
    const body = ctx.request.body;
    const email = body.email ? validator.trim(body.email) : '';
    const username = body.username ? validator.trim(body.username) : '';
    const password = body.password ? validator.trim(body.password) : '';
    const re_password = body.re_password ? validator.trim(body.re_password) : '';
    const isNull = [email, username, password, re_password].some((ele) => { return ele === '' });
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

        ctx.body = {
            user: user.toJSON(),
            token: user.generateToken()
        }
    } catch (err) {
        ctx.throw(422, err.message)
    }
}

export async function getUsers (ctx) {
    const users = await User.find({});
    ctx.body = { users }
}

export async function getUser (ctx, next) {
    try {
        const user = await User.findById(ctx.params.id);
        if (!user) {
            ctx.throw(404)
        }
        ctx.body = { user: user.base_info }
    } catch (err) {
        if (err === 404 || err.name === 'CastError') {
            ctx.throw(404)
        }
        ctx.throw(500)
    }

    if (next) { return next() }
}

export async function updateUser (ctx) {
    const user = ctx.body.

    Object.assign(user, ctx.request.body.user)

    await user.save()

    ctx.body = {
        user
    }
}

export async function deleteUser (ctx) {
    const user = ctx.body.user

    await user.remove()

    ctx.status = 200
    ctx.body = {
        success: true
    }
}

import jwt from 'koa-jwt'
import compose from 'koa-compose'
import config from '../../config'

// 验证用户是否登录

function isAuthenticated() {
    return compose([
        (ctx, next) => {
            if (ctx.query && ctx.query.access_token) {
                this.headers.authorization = 'Bearer ' + this.query.access_token;
            }
            return next();
        },
        jwt({secret: config.secret, passthrough: false}),
        (ctx, next) => {
            if (!this.state.user) {
                ctx.state = 400;
            }
            return next();
        },
        async (ctx, next) => {
            var user = await User.findOne({id: this.state.user._id});
            if (!user) {
                ctx.state = 401;
            }
            ctx.user = user;
            return next();
        }
    ])
}

function signToken(id) {
    return jwt.sign({ _id: id }, config.secret, { expiresIn: '1d' });
}

export {
    signToken
    isAuthenticated
}

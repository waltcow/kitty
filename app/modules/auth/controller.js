import passport from 'koa-passport'

export async function authUser(ctx, next) {
    return passport.authenticate('local', (err, user) => {
        if (!user) {
            ctx.throw(401)
        }
        ctx.body = {
            token: user.generateToken(),
            user: user.toJSON()
        }
    })(ctx, next)
}

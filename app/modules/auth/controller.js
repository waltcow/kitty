import passport from 'koa-passport'

export async function authUser(ctx, next) {
    return passport.authenticate('local', (user) => {
        console.log(user)
        if (!user) {
            ctx.throw(401)
        }
        ctx.body = {
            token: user.generateToken(),
            user: user.toJSON()
        }
    })(ctx, next)
}

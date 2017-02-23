import passport from 'koa-passport';
import { User } from '../app/models';
import { Strategy } from 'passport-local';
import { logger } from '../app/utils/logger'

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (email, done) => {
    try {
        const user = await User.findOne({ email });
        done(null, user)
    } catch (err) {
        done(err)
    }
});

passport.use('local', new Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.error('登录用户名错误',{ email });
            return done(null, false)
        }

        if (user.authenticate(password)) {
            logger.error('登录密码错误',{ email });
            return done(null, false, { error_msg: '用户名或密码错误.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err)
    }
}));

export default passport;

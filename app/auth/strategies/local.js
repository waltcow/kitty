import LocalStrategy from 'passport-local'
import {logger} from '../../utils/logger'

function registerLocal(passport, User) {
    const strategy = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' //virtual field
    }, async (email, password, done) => {
        const user = await User.findOne({email});
        if (!user) {
            logger.error('登录用户名错误',{username: email});
            return done(null, false, { error_msg: '用户名或密码错误.' });
        }
        if (!user.authenticate(password)) {
            logger.error('登录密码错误',{username: email});
            return done(null, false, { error_msg: '用户名或密码错误.' });
        }
        if (!user.active){
            logger.error('被阻止登录', {username: email});
            return done(null, false, { error_msg: '用户被阻止登录.' });
        }
    });
    passport.use(strategy);
}

export default registerLocal;

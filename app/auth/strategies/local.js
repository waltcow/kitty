import {Strategy as LocalStrategy} from 'passport-local';
import { User } from '../../models';
import logger from '../../utils/logger';

export function registerLocal(passport) {
    passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (username, password, done) => {
        try {
            const user = await User.findOne({username});
            if (!user) {
                logger.error('登录用户名错误',{'username': username});
                return done(null, false, { error_msg: '用户名或密码错误.' });
            }
            if (user.authenticate(password)) {
                logger.error('登录密码错误',{'username': username});
                return done(null, false, { error_msg: '用户名或密码错误.' });
            }
            return done(null, user);
        } catch (error) {
            logger.debug('LocalStrategy error');
            done(error);
        }
    }));
}




import passport from 'koa-passport'
import registerLocal from './strategies/local'
import models from '../models'


passport.serializeUser((user, done) => done(null, user.email));
passport.deserializeUser(async(username, done) => {
    done(null, await models.User.findOne({email}));
});

registerLocal(passport, User);

export function isLocalAuthenticated() {
    return passport.authenticate('local', {session: false});
}

export default passport;

import passport from 'koa-passport';
import { User } from '../models';

import {registerLocal} from './strategies/local';

passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser(async(username, done) => {
    done(null, await User.findOne({username}));
});

registerLocal(passport);

export function isLocalAuthenticated() {
    return passport.authenticate('local', {session: false});
}

export default passport;

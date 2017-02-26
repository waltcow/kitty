import { User } from '../models'
import config from '../../config'
import { getToken } from '../utils/tool'
import { verify } from 'jsonwebtoken'

export async function authToken(ctx, next) {
    const token = getToken(ctx);
    if (!token) {
        ctx.throw(401, 'Bad Authorization header format. Format is "Authorization: Bearer <token>"\n');
    }
    let decoded = null;
    try {
        decoded = verify(token, config.tokenSecret);
    } catch (err) {
        ctx.throw(401, 'Unauthorized Error, token is illegal');
    }

    ctx.state.user = await User.findById(decoded._id);
    if (!ctx.state.user) {
        ctx.throw(401, 'Unauthorized Error, token is illegal');
    }
    return next();
}

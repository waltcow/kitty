import {User} from '../models'
import config from '../../config'
import { getToken } from '../utils/tool'
import { verify } from 'jsonwebtoken'

export async function ensureUser(ctx, next) {
    const token = getToken(ctx);
    if (!token) {
        ctx.throw(401)
    }
    let decoded = null;
    try {
        decoded = verify(token, config.token);
    } catch (err) {
        ctx.throw(401);
    }

    ctx.state.user = await User.findById(decoded.id).toJSON();
    if (!ctx.state.user) {
        ctx.throw(401);
    }
    return next();
}

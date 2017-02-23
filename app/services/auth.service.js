import jwt from 'koa-jwt'
import config from '../../config'

function signToken(id) {
    return jwt.sign({ _id: id }, config.secretKeyBase, { expiresIn: '1y' });
}

export default {
    signToken
}

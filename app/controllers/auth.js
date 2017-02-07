import passport from "koa-passport"
import Strategy from "passport-local"
import jwt from "jsonwebtoken"
import uid from "uid-safe"
import config from "../../config"
import {createRedisStore} from "../connect_client/redis"

const redisStore = createRedisStore();

const signToken = (payload, secret, options) => {
    return new Promise(function (resolve, reject) {
        jwt.sign(payload, secret, options, function (err, token) {
            if (err) return reject(err);
            resolve(token);
        })
    })
};

const generateTokens = async (payload, secret, opts = {}) => {
    try {
        const { auth } = config;
        const accessTokenId = uid.sync(6);
        const refreshTokenId = uid.sync(6);

        const accessTokenPayload = Object.assign({}, payload, { jti: accessTokenId });
        const refreshTokenPayload = Object.assign({}, {
            jti: refreshTokenId,
            ati: accessTokenId
        });

        const refreshTokenOpts = Object.assign({}, {
            expiresIn: auth.refreshTokenTtl
        }, opts);

        const accessTokenOpts = Object.assign({}, {
            expiresIn: auth.accessTokenTtl
        }, opts);

        const refreshToken = await signToken(refreshTokenPayload, secret, refreshTokenOpts);
        const accessToken = await signToken(accessTokenPayload, secret, accessTokenOpts);

        await redisStore.client.setex(refreshTokenId, auth.refreshTokenTtl, payload.user.username);

        return Promise.resolve({
            accessToken,
            refreshToken
        });

    } catch(e) {

        return Promise.reject(e);

    }
};

const LocalStrategy = new Strategy(function (username, password, done) {
    if (username === "test" && password === "test") {
        done(null, {
            username: "test",
            verified: "true"
        }, { message: 'Success' });
    } else if (username !== "test" || password !== "test") {
        done(null, false, { message: 'Incorrect username or password.' });
    }
});


passport.use(LocalStrategy);

export const localAuthHandler = (ctx, next) => {
    return passport.authenticate('local', async (err, user, info) => {
        if (user === false) {
            ctx.status = 401;
            ctx.body = info.message;
        } else {
            try {
                const { accessToken, refreshToken } = await generateTokens({user}, "secret");
                ctx.body = {
                    accessToken,
                    refreshToken
                }
            } catch (e) {
                ctx.throw(500, e);
            }
        }
    })(ctx, next);
};

export default {
    initialize: () => passport.initialize(),
    authenticate: () => localAuthHandler()
}

export default passport;

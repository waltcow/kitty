import uid from 'uid-safe';
import deepEqual from 'deep-equal';

// Basic session store class

class Store {
    constructor(store) {
        this.store = store
    }

    async get(sid) {
        return await this.store.get(sid)
    }

    async set(sid, val, ttl) {
        await this.store.set(sid, val, ttl);
        return sid;
    }

    async destroy(sid) {
        return await this.store.destroy(sid);
    }
};


const ONE_DAY = 24 * 3600 * 1000; // one day in milliseconds

const cookieOpt = (cookie) => {
    const options = Object.assign({
        maxAge: 0, // default to use session cookie
        path: '/',
        httpOnly: true
    }, cookie || {}, {
        overwrite: true, // overwrite previous session cookie changes
        signed: false // disable signed option
    });
    if (!(options.maxAge >= 0)) options.maxAge = 0;
    return options;
};

const deleteSession = (ctx, key, cookie, store, sid) => {
    const options = cookie instanceof Function ? cookieOpt(cookie(ctx)) : Object.assign({}, cookie);
    delete options.maxAge;
    ctx.cookies.set(key, null, options);
    store.destroy(`${key}:${sid}`);
};

const saveSession = (ctx, key, cookie, store, sid) => {
    const options = cookie instanceof Function ? cookieOpt(cookie(ctx)) : cookie;
    const ttl = options.maxAge > 0 ? options.maxAge : ONE_DAY;
    ctx.cookies.set(key, sid, options);
    store.set(`${key}:${sid}`, ctx.session, ttl);
};

const cleanSession = (ctx) => {
    if (!ctx.session || typeof ctx.session !== 'object') ctx.session = {};
};

function createSessionMiddleware (options) {
    const opt = options || {};
    const key = opt.key || 'koa:sess';
    const store = new Store(opt.store);
    const cookie = opt.cookie instanceof Function ? opt.cookie : cookieOpt(opt.cookie);

    return async (ctx, next) => {
        // initialize session id and data
        const cookieSid = ctx.cookies.get(key);
        let sid = cookieSid;
        if (!sid) {
            sid = uid.sync(24); // generate new sid for user
            ctx.session = {};
        } else {
            ctx.session = await store.get(`${key}:${sid}`); // retrieve previous session from store
            cleanSession(ctx);
        }

        const sessionClone = Object.assign({}, ctx.session);

        // expose session handler to ctx
        ctx.sessionHandler = {
            regenerateId: () => {
                sid = uid.sync(24);
            },
        };

        await next();

        cleanSession(ctx);

        const sessionHasData = Object.keys(ctx.session).length > 0;

        if (sid !== cookieSid) { // a new session id
            // delete old session
            if (cookieSid) deleteSession(ctx, key, cookie, store, cookieSid);

            // save new session
            if (sessionHasData) saveSession(ctx, key, cookie, store, sid);
        } else { // an existing session
            // session data has not been changed
            if (deepEqual(ctx.session, sessionClone)) return;

            // update / delete session
            const doSession = sessionHasData ? saveSession : deleteSession;
            doSession(ctx, key, cookie, store, sid)
        }
    }
}

export { createSessionMiddleware as default, Store}

import Koa from 'koa';
import request from 'supertest';
import {expect} from 'chai';
import session from '../../app/middlewares/session';
import {createRedisStore} from '../../app/connect_client/redis';

const DEFAULT_KEY = 'koa:sess';
const DEFAULT_TTL = 24 * 3600 * 1000; // ONE DAY in milliseconds

const getClient = (opts) => {
    const app = new Koa();

    const updateSession = (ctx, next) => {
        switch (ctx.url) {
            case '/set/time':
                ctx.session.time = Date.now();
                break;
            case '/set/random':
                ctx.session.random = Math.random();
                break;
            case '/set/null':
                ctx.session = null;
                break;
            case '/set/undefined':
                delete ctx.session;
                break;
            case '/set/empty':
                ctx.session = {};
                break;
            case '/regenerate_id':
                ctx.sessionHandler.regenerateId();
                break;
            default:
                if (ctx.url.startsWith('/maxage/')) {
                    ctx.maxAge = parseInt(ctx.url.replace('/maxage/', ''), 10);
                    ctx.session.time = Date.now();
                }
        }
        next()
    };

    const sessionToBody = (ctx) => {
        ctx.body = {
            data: ctx.session,
        }
    };

    app.use(session(opts));
    app.use(updateSession);
    app.use(sessionToBody);

    return request(app.listen());
};

const getCookies = (res) => {
    const cookies = res.header['set-cookie'];
    if (cookies) {
        return cookies.map((c) => {
            const match = c.match(/([^=]*)=([^;]*); path=([^;]*); /);
            if (match) {
                return {
                    name: match[1],
                    value: match[2],
                    path: match[3],
                }
            }
            return null;
        })
    }

    return null;
};

const getSessionId = (res) => {
    const cookies = getCookies(res);
    return cookies ? cookies[0].value : null
};

const validateCookie = (res, key) => {
    const cookies = getCookies(res);
    expect(cookies.length).to.be.equal(1);
    expect(cookies[0].name).to.be.equal(key);
    expect(cookies[0].path).to.be.equal('/');
};

const store = createRedisStore();

describe('empty session', () => {
    const clientSpyStore = getClient({store});

    it('should not set cookie', (done) => {
        clientSpyStore.get('/').expect(200).end((err2, res2) => {
            if (err2) return done(err2);
            expect('set-cookie' in res2.header).to.be.equal(false);
            done()
        })
    });

    it('should not store session data', (done) => {
        clientSpyStore.get('/').expect(200).end((err, res) => {
            if (err) return done(err);
            expect(res.body.data).to.be.deep.equal({});
            done()
        })
    })
});


describe('session key', () => {
    const clientDefault = getClient({store});

    const KEY = 'SID';
    const clientKey = getClient({key: KEY, store});

    beforeEach(() => {
        return store._redisClient.flushdb();
    });

    it('cookie name should be set to default key', (done) => {
        clientDefault.get('/set/time').expect(200).end((err, res) => {
            if (err) return done(err);
            validateCookie(res, DEFAULT_KEY);
            done()
        })
    });

    it('store prefix should be set to default key', (done) => {
        clientDefault.get('/set/time').expect(200).end((err, res) => {
            if (err) return done(err);
            let sid = DEFAULT_KEY + ':' + getSessionId(res);
            let pair = res.body.data;
            store.get(sid).then(function (res) {
                expect(res).to.deep.equal(pair);
                done()
            }).catch(function (err) {
                console.debug(err);
                done(err);
            })
        })
    });

    it('cookie name should be set to customized key, when using customized key', (done) => {
        clientKey.get('/set/time').expect(200).end((err, res) => {
            if (err) return done(err);
            validateCookie(res, KEY);
            done()
        })
    });

    it('store prefix should be set to customized key, when using customized key', (done) => {
        clientKey.get('/set/time').expect(200).end((err, res) => {
            let sid = KEY + ':' + getSessionId(res);
            let pair = res.body.data;
            store.get(sid).then(function (res) {
                expect(res).to.deep.equal(pair);
                done();
            }).catch(function (err) {
                console.debug(err);
                done(err);
            })
        })
    })
});


describe('cookie related maxAge and ttl', () => {
    const clientDefault = getClient({
        store
    });

    const clientZero = getClient({
        store,
        cookie: {
            maxAge: 0
        }
    });

    const clientNegative = getClient({
        store,
        cookie: {
            maxAge: -1000
        }
    });

    const clientPositive = getClient({
        store,
        cookie: {
            maxAge: 1000,
        }
    });

    beforeEach(() => {
        return store._redisClient.flushdb();
    });

    it('cookie should not have expire time by default', (done) => {
        clientDefault.get('/set/time').expect(200).end((err, res) => {
            if (err) return done(err);
            validateCookie(res, DEFAULT_KEY);
            expect(res.header['set-cookie'][0].includes('expires=')).to.be.equal(false);
            done()
        })
    });

    it('store ttl should be DEFAULT_TTL by default', (done) => {
        clientDefault.get('/set/time').expect(200).end((err, res) => {
            let sid = DEFAULT_KEY + ':' + getSessionId(res);
            store.client.ttl(sid).then(function (res) {
                expect(res).to.eql(DEFAULT_TTL / 1000);
                done();
            }).catch(function (err) {
                done(err);
            });
        })
    });

    it('cookie should not have expire time, if maxAge = 0', (done) => {
        clientZero.get('/set/time').expect(200).end((err, res) => {
            if (err) return done(err);
            validateCookie(res, DEFAULT_KEY);
            expect(res.header['set-cookie'][0].includes('expires=')).to.be.equal(false);
            done()
        })
    });

    it('store ttl should be DEFAULT_TTL, if maxAge = 0', (done) => {
        clientZero.get('/set/time').expect(200).end((err, res) => {
            if (err) return done(err);
            let sid = DEFAULT_KEY + ':' + getSessionId(res);
            store.client.ttl(sid).then(function (res) {
                expect(res).to.eql(DEFAULT_TTL / 1000);
                done();
            }).catch(function (err) {
                done(err);
            });
        })
    });

    it('cookie should not have expire time, if maxAge < 0', (done) => {
        clientNegative.get('/set/time').expect(200).end((err, res) => {
            if (err) return done(err);
            validateCookie(res, DEFAULT_KEY);
            expect(res.header['set-cookie'][0].includes('expires=')).to.be.equal(false);
            done();
        })
    });

    it('cookie should not have expire time, if maxAge > 0', (done) => {
        clientPositive.get('/set/time').expect(200).end((err, res) => {
            if (err) return done(err);
            validateCookie(res, DEFAULT_KEY);
            expect(res.header['set-cookie'][0].includes('expires=')).to.be.equal(true);
            done()
        })
    });
});

describe('cookie options', () => {
    const client1 = getClient({
        store,
        cookie: {
            maxAge: 1000,
            path: '/path1',
            domain: 'www.example1.com',
            secure: false,
            httpOnly: true
        },
    });

    const client2 = getClient({
        store,
        cookie: {
            maxAge: 2000,
            path: '/path2',
            domain: 'www.example2.com',
            secure: false,
            httpOnly: false
        },
    });

    beforeEach(() => {
        return store._redisClient.flushdb();
    });

    it('can set cookie options via an object', (done) => {
        Promise.all([
            new Promise((resolve, reject) => {
                client1.get('/set/time').expect(200).end((err, res) => {
                    if (err) reject(err);
                    const cookie = res.header['set-cookie'][0];
                    expect(cookie.includes(`${DEFAULT_KEY}=`)).to.be.equal(true);
                    expect(cookie.includes('expires=')).to.be.equal(true);
                    expect(cookie.includes('path=')).to.be.equal(true);
                    expect(cookie.includes('domain=')).to.be.equal(true);
                    expect(cookie.includes('secure')).to.be.equal(false);
                    expect(cookie.includes('httponly')).to.be.equal(true);
                    resolve();
                })
            }),
            new Promise((resolve, reject) => {
                client2.get('/set/time').expect(200).end((err, res) => {
                    if (err) reject(err);
                    const cookie = res.header['set-cookie'][0];
                    expect(cookie.includes(`${DEFAULT_KEY}=`)).to.be.equal(true);
                    expect(cookie.includes('expires=')).to.be.equal(true);
                    expect(cookie.includes('path=')).to.be.equal(true);
                    expect(cookie.includes('domain=')).to.be.equal(true);
                    expect(cookie.includes('secure')).to.be.equal(false);
                    expect(cookie.includes('httponly')).to.be.equal(false);
                    resolve();
                })
            }),
        ]).then(() => {
            done()
        }).catch(done)
    });

    const clientDynamic = getClient({
        store,
        cookie: ctx => ({
            maxAge: ctx.maxAge
        })
    });

    it('can set cookie options via a function', (done) => {
        clientDynamic.get('/maxage/1000').expect(200).end((err1, res1) => {
            if (err1) return done(err1)
            validateCookie(res1, DEFAULT_KEY)
            expect(res1.header['set-cookie'][0].includes('expires=')).to.be.equal(true)

            clientDynamic.get('/maxage/0').expect(200).end((err2, res2) => {
                if (err2) return done(err2)
                validateCookie(res2, DEFAULT_KEY)
                expect(res2.header['set-cookie'][0].includes('expires=')).to.be.equal(false)
                done()
            })
        })
    })
});

describe('session data', () => {
    const client = getClient({
        store
    });

    beforeEach(() => {
        return store._redisClient.flushdb();
    });

    it('session data is available among multiple requests', (done) => {
        client.get('/set/random').expect(200).end((err1, res1) => {
            if (err1) return done(err1);
            const sid = getSessionId(res1);

            client.get('/set/random').expect(200).end((err2, res2) => {
                if (err2) return done(err2);
                expect(getSessionId(res2)).to.be.not.equal(sid);
                expect(res2.body.data).to.be.not.deep.equal(res1.body.data);

                client.get('/').set('cookie', `${DEFAULT_KEY}=${sid}`)
                    .expect(200).end((err3, res3) => {
                    if (err3) return done(err3);
                    expect('set-cookie' in res3.header).to.be.equal(false);
                    expect(res3.body.data).to.be.deep.equal(res1.body.data);
                    done()
                })
            })
        })
    });

    it('session data will be empty if not exist in store', (done) => {
        client.get('/set/random').expect(200).end((err1, res1) => {
            if (err1) return done(err1);
            const sid = getSessionId(res1);
            store._redisClient.flushdb();

            client.get('/set/random').expect(200).end((err2, res2) => {
                if (err2) return done(err2);
                expect(getSessionId(res2)).to.be.not.equal(sid);
                expect(res2.body.data).to.be.not.deep.equal(res1.body.data);

                client.get('/').set('cookie', `${DEFAULT_KEY}=${sid}`)
                    .expect(200).end((err3, res3) => {
                    if (err3) return done(err3);
                    expect('set-cookie' in res3.header).to.be.equal(false);
                    expect(res3.body.data).to.be.deep.equal({});
                    done();
                })
            })
        })
    });

    it('will update cookie and store when data is changed', (done) => {
        client.get('/set/random').expect(200).end((err1, res1) => {
            if (err1) return done(err1);
            const sid = getSessionId(res1);

            client.get('/set/random').expect(200).end((err2, res2) => {
                if (err2) return done(err2);
                expect(getSessionId(res2)).to.be.not.equal(sid);
                expect(res2.body.data).to.be.not.deep.equal(res1.body.data);
                client.get('/set/random').set('cookie', `${DEFAULT_KEY}=${sid}`)
                    .expect(200).end((err3, res3) => {
                    if (err3) return done(err3);
                    expect('set-cookie' in res3.header).to.be.equal(true);
                    expect(getSessionId(res3)).to.be.equal(sid);
                    expect(res3.body.data).to.be.not.deep.equal(res1.body.data);
                    done();
                })
            })
        })
    });

    it('will delete cookie and storage when set ctx.session to {}', (done) => {
        client.get('/set/random').expect(200).end((err1, res1) => {
            if (err1) return done(err1);
            const sid = getSessionId(res1);

            client.get('/set/random').expect(200).end((err2, res2) => {
                if (err2) return done(err2);
                expect(getSessionId(res2)).to.be.not.equal(sid);
                expect(res2.body.data).to.be.not.deep.equal(res1.body.data);
                client.get('/set/empty').set('cookie', `${DEFAULT_KEY}=${sid}`)
                    .expect(200).end((err3, res3) => {
                    if (err3) return done(err3);
                    expect(getSessionId(res3)).to.be.equal('');
                    expect(res3.body.data).to.be.deep.equal({});
                    done();
                })
            })
        })
    });

    it('will delete cookie and storage when set ctx.session to null', (done) => {
        client.get('/set/random').expect(200).end((err1, res1) => {
            if (err1) return done(err1);
            const sid = getSessionId(res1);

            client.get('/set/random').expect(200).end((err2, res2) => {
                if (err2) return done(err2);
                expect(getSessionId(res2)).to.be.not.equal(sid);
                expect(res2.body.data).to.be.not.deep.equal(res1.body.data);
                client.get('/set/null').set('cookie', `${DEFAULT_KEY}=${sid}`)
                    .expect(200).end((err3, res3) => {
                    if (err3) return done(err3);
                    expect('set-cookie' in res3.header).to.be.equal(true);
                    expect(getSessionId(res3)).to.be.equal('');
                    expect(res3.body.data).to.be.deep.equal(null);
                    done();
                })
            })
        })
    });

    it('will delete cookie and storage when ctx.session is deleted', (done) => {
        client.get('/set/random').expect(200).end((err1, res1) => {
            if (err1) return done(err1);
            const sid = getSessionId(res1);

            client.get('/set/random').expect(200).end((err2, res2) => {
                if (err2) return done(err2);
                expect(getSessionId(res2)).to.be.not.equal(sid);
                expect(res2.body.data).to.be.not.deep.equal(res1.body.data);
                client.get('/set/undefined').set('cookie', `${DEFAULT_KEY}=${sid}`)
                    .expect(200).end((err3, res3) => {
                    if (err3) return done(err3);
                    expect('set-cookie' in res3.header).to.be.equal(true);
                    expect(getSessionId(res3)).to.be.equal('');
                    expect(res3.body.data).to.be.deep.equal(undefined);
                    done();
                })
            })
        })
    })
});

describe('roll session id', () => {
    const client = getClient({
        store
    });

    beforeEach(() => {
        return store._redisClient.flushdb();
    });

    it('regenerateId() will regnerate cookie and session', (done) => {
        client.get('/set/random').expect(200).end((err1, res1) => {
            if (err1) return done(err1);
            const sid = getSessionId(res1);

            client.get('/set/random').expect(200).end((err2, res2) => {
                if (err2) return done(err2);
                expect(getSessionId(res2)).to.be.not.equal(sid);
                expect(res2.body.data).to.be.not.deep.equal(res1.body.data);

                client.get('/regenerate_id').set('cookie', `${DEFAULT_KEY}=${sid}`)
                    .expect(200).end((err3, res3) => {
                    if (err3) return done(err3);
                    const newSid = getSessionId(res3);
                    expect('set-cookie' in res3.header).to.be.equal(true);
                    expect(newSid).to.be.not.equal(sid);
                    expect(res3.body.data).to.be.deep.equal(res1.body.data);
                    done();
                })
            })
        })
    })
});

import Koa from 'koa';
import request from 'supertest';
import {expect} from 'chai';
import cache from '../../app/middlewares/cache';

let getClient = function () {
    const app = new Koa();
    const routes = async (ctx, next) => {
        switch (ctx.url) {
            case '/set':
                await ctx.cache.set('test', {a: 'foo', b: 'bar'});
                ctx.body = {
                    data: {code: 'OK'}
                };
                break;
            case '/get':
                let data = await ctx.cache.get('test');
                ctx.body = {data};
                break;
        }
        next();
    };
    app.use(cache());
    app.use(routes);
    return request(app.listen());
};

describe('cache middleware with default options', () => {
    it('should cache k-v pair in redis store', function (done) {
        const client = getClient();
        client.get('/set').expect(200).end(function (err, res) {
            if (err) return done(err);
            client.get('/get').expect(200).end(function (err, res1) {
                expect(res1.body.data).to.eql({a: 'foo', b: 'bar'});
                done();
            })
        });
    })
});

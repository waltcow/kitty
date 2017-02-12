import RedisStore from '../../app/connect_client/redis';
import { expect } from 'chai';

describe('redis connect and basic use', function () {
    var redisStore;

    before('create redis store', function() {
        redisStore = RedisStore.connect();
    });

    it('should be an instance of RedisStore', function () {
        expect(redisStore).to.be.instanceof(RedisStore);
    });

    it('should set / get an k-v pair in redis store', function (done) {
        let getPairs = () => redisStore.get('test');
        redisStore.set('test', {a: 'foo', b: 'bar'}).then(getPairs).then(function (res) {
            expect(res).to.eql({a: 'foo', b: 'bar'});
            done();
        }).catch(function (err) {
            console.debug(err);
            done(err);
        });
    });

    it('shoud not exist key when del it', function (done) {
        let delPair = (key) => redisStore.destroy(key);
        redisStore.set('test', {a: 'foo', b: 'bar'})
            .then(delPair('test'))
            .then(function (res) {
            expect(res).to.eql(undefined);
            done();
        }).catch(function (err) {
            console.debug(err);
            done(err);
        })
    });

    it('should not be exist when it was expired', function (done) {
        let delay = function() {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, 2000)
            })
        };
        let getPairs = () => redisStore.get('test');
        redisStore.set('test', {a: 'foo', b: 'bar'}, 2000)
            .then(delay)
            .then(getPairs)
            .then(function (res) {
                expect(res).to.eqls(null);
                done();
        }).catch(function (err) {
            console.debug(err);
            done(err);
        })
    });

    after('quit redis client', function () {
        if (redisStore) {
            redisStore.quit()
        }
    });
});

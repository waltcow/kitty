import redis from 'redis';
import redisWrapper from 'co-redis';
import config from '../../config';

class RedisStore {
    constructor(options) {
        options.auth_pass = options.auth_pass || options.pass || null;
        options.path = options.path || options.socket || null;
        this.client = redisWrapper(redis.createClient(options));
    }
    static connect() {
        let instance = null;
        if (!instance || !instance.connected) {
            instance = new RedisStore({
                url: config.redisUrl,
                password: config.redisPassword
            });
        }
        return instance;
    }

    async get(key) {
        var data = await this.client.get(key);
        if (!data) {
            return null;
        }
        try {
            return JSON.parse(data.toString());
        } catch (err) {
            // ignore err
        }
    }

    async set(key, val, ttl) {
        if (typeof ttl === 'number') {
            ttl = Math.ceil(ttl / 1000);
        }
        val = JSON.stringify(val);
        if (ttl) {
            await this.client.setex(key, ttl, val);
        } else {
            await this.client.set(key, val);
        }
    }

    async destroy(key) {
        return await this.client.del(key);
    }

    async quit() {
        await this.client.quit();
    }
}

export default RedisStore;

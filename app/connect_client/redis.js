import redis from 'redis';
import redisWrapper from 'co-redis';
import config from '../../config';
import {logger} from '../utils/logger'

class RedisStore {
    constructor(options) {
        let redisClient = RedisStore.createRedisClient(options);
        this.client = redisWrapper(redisClient);
    }
    static connect(option) {
        let instance = null;
        if (!instance || !instance.connected) {
            instance = new RedisStore(option);
        }
        return instance;
    }
    static createRedisClient(options) {
        options = options || config.redisURI;
        let client = redis.createClient(options);
        return client.on('ready', () => {
            logger.info('redis connection is established')
        }).on('error', (msg) => {
            logger.info(msg, 'redis encounter an error connecting to the Redis server')
        }).on('end', () => {
            logger.info('established Redis server connection has closed')
        }).on('reconnecting', () => {
            logger.info('Redis server connection reconnecting')
        });
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

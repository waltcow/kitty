import {createRedisStore} from "../connect_client/redis";

export default (options) => {
    const middleOptions = options || {};
    const prefix = middleOptions.prefix || 'kitty.cache:';
    const expire = middleOptions.expire || 1800 * 1000;
    const redisClient = createRedisStore();

    const set = async function(key, value, cacheOptions) {
        if (!redisClient.connected || value == null) return;
        const currentOptions = cacheOptions || {};
        key = prefix + key;
        const ttl = currentOptions.expire || expire;
        value = JSON.stringify(value);
        await redisClient.set(key, ttl, value);
    };

    const get = async function(key) {
        if (!redisClient.connected) return null;
        key = prefix + key;
        let data = await redisClient.get(key);
        data && JSON.parse(data.toString());
        return data;
    };

    return async function(ctx, next) {
        ctx.cache = { get, set };
        await next();
    };
};

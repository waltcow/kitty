import configureRedis from "../connect_client/redis";

function cacheMiddleware(options) {
    const middleOptions = options || {};
    const prefix = middleOptions.prefix || 'kitty-cache:';
    const expire = middleOptions.expire || 1800;

    let redisAvailable = false;

    const redisClient = configureRedis();

    redisClient.on('error', () => { redisAvailable = false });
    redisClient.on('end', () => { redisAvailable = false });
    redisClient.on('connect', () => { redisAvailable = true });

    const setCache = async function(key, value, cacheOptions) {
        if (!redisAvailable) return;
        if (value == null) return;
        const currentOptions = cacheOptions || {};
        key = prefix + key;
        const ttl = currentOptions.expire || expire;
        value = JSON.stringify(value);
        await redisClient.setex(key, ttl, value);
    };

    const getCache = async function(key) {
        if (!redisAvailable) return null;
        key = prefix + key;
        let data = await redisClient.get(key);
        data && JSON.parse(data.toString());
        return data;
    };

    return async function(ctx, next) {
        ctx.cache = {
            get: getCache,
            set: setCache
        };
        await next();
    };
}

export default cacheMiddleware;

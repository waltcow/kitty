import RedisStore from "../connect_client/redis";

export default (options) => {
    const middleOptions = options || {};
    const prefix = middleOptions.prefix || 'kitty.cache:';
    const expire = middleOptions.expire || 1800 * 1000;
    const store = RedisStore.connect();

    const set = async function(key, value, cacheOptions) {
        if (!store.client.connected || value == null) return;
        const currentOptions = cacheOptions || {};
        key = prefix + key;
        const ttl = currentOptions.expire || expire;
        await store.set(key, value, ttl);
    };

    const get = async function(key) {
        if (!store.client.connected) return null;
        key = prefix + key;
        return await store.get(key);
    };

    return async (ctx, next) => {
        ctx.cache = { get, set };
        await next();
    };
};

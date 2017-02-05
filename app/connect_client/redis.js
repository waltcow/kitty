import EventEmitter from 'events';
import redis from 'redis';
import redisWrapper from 'co-redis';
import config from '../../config';

class RedisStore extends EventEmitter {
    constructor(options) {
        super();
        this.connected = false;
        this._redisClient = this._initRedisClient(options);
        this._bindConnectEvents();
        this.client = redisWrapper(this._redisClient); // promisify redis client
    }

    _initRedisClient(options = {}) {
        options.auth_pass = options.auth_pass || options.pass || null;     // For backwards compatibility
        options.path = options.path || options.socket || null;             // For backwards compatibility
        let client;
        if (!options.client) {
            client = redis.createClient(options);
        } else {
            client = options.client;
        }
        if (options.db) {
            client.select(options.db);
            client.on('connect', function() {
                client.send_anyways = true;
                client.select(options.db);
                client.send_anyways = false;
            });
        }
        client.on('error', this.emit.bind(this, 'error'));
        client.on('end', this.emit.bind(this, 'end'));
        client.on('end', this.emit.bind(this, 'disconnect'));              // For backwards compatibility
        client.on('connect', this.emit.bind(this, 'connect'));
        client.on('reconnecting', this.emit.bind(this, 'reconnecting'));
        client.on('ready', this.emit.bind(this, 'ready'));
        client.on('warning', this.emit.bind(this, 'warning'));
        return client;
    }

    _bindConnectEvents() {
        this.on('connect', function() {
            this.connected = this._redisClient.connected;
        });
        this.on('end', function() {
            this.connected = this._redisClient.connected;
        });
        // No good way to test error
        /* istanbul ignore next */
        this.on('error', function() {
            this.connected = this._redisClient.connected;
        });
        // No good way to test reconnect
        /* istanbul ignore next */
        this.on('reconnecting', function() {
            this.connected = this._redisClient.connected;
        });
        // No good way to test warning
        /* istanbul ignore next */
        this.on('warning', function() {
            this.connected = this._redisClient.connected;
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

    async destory(key) {
        await this.client.del(key);
    }

    async quit() {
        await this.client.quit();
    }
    async end() {
        await this.client.quit();
    }
}

function createRedisStore() {
    return new RedisStore({
        url: config.redisUrl,
        password: config.redisPassword
    })
}

export { RedisStore as default, createRedisStore }

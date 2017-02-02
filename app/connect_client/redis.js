var redis = require('redis');
import config from '../../config';

const connect = function () {
    return redis.createClient({
        url: config.redisUrl,
        auth_pass: config.redisPassword
    });
};

export default connect;

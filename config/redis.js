var redis = require('redis');
var config = require('./index');

var redisClient = redis.createClient(config.redisUrl, { password: config.redisPassword });

module.exports = redisClient;

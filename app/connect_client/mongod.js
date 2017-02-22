import mongoose from 'mongoose';
import util from 'util';
import {logger} from './../utils/logger';
import config from '../../config';

const mongoConfig = config.mongo;

//(mongoose’s default promise library) is deprecated, plug in your own promise library instead:
mongoose.Promise = global.Promise;

function connect(uri) {
    const connectStr = uri || util.format('mongodb://%s:%s@%s:%d/%s', mongoConfig.user, mongoConfig.password, mongoConfig.hostname, mongoConfig.port, mongoConfig.database);
    return new Promise((resolve, reject) => {
        mongoose.connection
            .on('error', function (err) {
                reject(err)
            })
            .on('close', function () {
                logger.error('mongo connect close');
            })
            .once('open', function () {
                resolve(mongoose.connections[0]);
            });
        mongoose.connect(connectStr);
    });
}

export default {
    connect
}


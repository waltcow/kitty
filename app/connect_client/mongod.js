import mongoose from 'mongoose';
import util from 'util';
import {logger} from './../utils/logger';
import config from '../../config';

const mongoConfig = config.mongo;

//(mongoose’s default promise library) is deprecated, plug in your own promise library instead:
mongoose.Promise = global.Promise;

function connect() {
    const connectStr = util.format('mongodb://%s:%s@%s:%d/%s', mongoConfig.user, mongoConfig.password, mongoConfig.hostname, mongoConfig.port, mongoConfig.database);
    const connectArgs = [connectStr];
    // callback
    connectArgs.push(function(err) {
        if (err) {
            logger.error('mongo connect error', err);
            process.exit(1);
        }
        logger.info('mongodb client connect success');
    });
    return mongoose.connect.apply(mongoose, connectArgs);
}

export default {
    connect
}


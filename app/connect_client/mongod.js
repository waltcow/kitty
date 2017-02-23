import mongoose from 'mongoose';
import {logger} from './../utils/logger';
import config from '../../config';

//(mongoose’s default promise library) is deprecated, plug in your own promise library instead:
mongoose.Promise = global.Promise;

function connect(uri) {
    const connectStr = uri || config.mongodb;

    mongoose.connection.on('error', function (err) {
        logger.error(err, 'mongo connection err');
    }).on('close', function () {
        logger.error('mongo connection close');
    }).once('open', function () {
        logger.info('mongo connection establish');
    });

    return mongoose.connect(connectStr).catch((err) => {
        logger.error(err, 'mongo connection err');
    });
}

export default {
    connect
}


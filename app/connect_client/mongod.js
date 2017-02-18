import mongoose from 'mongoose';
import {logger} from './../utils/logger';
import config from '../../config';

const mongoConfig = config.mongo;

//(mongoose’s default promise library) is deprecated, plug in your own promise library instead:
mongoose.Promise = global.Promise;

function connect() {
    let connectArgs = [mongoConfig.host, mongoConfig.name, mongoConfig.port];
    let user = mongoConfig.user;
    let pass = mongoConfig.pwd || mongoConfig.password;

    if (user == null || pass == null) {
        logger.warn("try to connect mongo db without authentication, it is not safe enough and may cause commands execute failed!")
    }
    //options
    connectArgs.push({
        server: { poolSize: 20 },
        auth: true,
        user: user,
        pass: pass
    });
    // callback
    connectArgs.push(function(err) {
        if (err) {
            logger.error('mongo connect error', err);
            process.exit(1);
        }
    });
    return mongoose.connect.apply(mongoose, connectArgs);
}

export default {
    connect
}


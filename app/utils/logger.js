import path from 'path'
import bunyan from 'bunyan'
import config from '../../config'

const logger = bunyan.createLogger({
    name: 'kitty',
    serializers: {
        req: bunyan.stdSerializers.req,
        res: bunyan.stdSerializers.res,
        err: bunyan.stdSerializers.err
    },
    streams: [
        {
            level: 'info',
            stream: process.stdout
        },{
            level: 'trace',
            stream: process.stdout
        },
        {
            level: 'debug',
            stream: process.stderr
        },
        {
            type: 'rotating-file',
            level: 'error',
            path: path.join(config.root, 'logs/' + config.env + '-' +'error.log'),
            period: '1d',   // daily rotation
            count: 7        // keep 7 back copies
        }
    ]
});

function createLoggerMiddle() {
    return async (ctx, next) =>{
        ctx.logger = logger;
        await next();
    };
}

export {
    createLoggerMiddle as default,
    logger
}

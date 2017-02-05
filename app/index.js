import Koa from 'koa';
import session from 'koa-session2';
import CSRF from 'koa-csrf';
import views from 'koa-views';
import convert from 'koa-convert';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import methodOverride from 'koa-methodoverride';
import logger from 'koa-logger';
import serve from 'koa-static';
import configureRedis from './connect_client/redis';
import redisStore from 'koa-redis';
import config from '../config';
import router from './routes';
import cacheMiddleware from './middlewares/cache';

const app = new Koa();
// use for cookie signature
app.keys = [config.secretKeyBase];

// not serve static when deploy
if (config.serveStatic){
    app.use(convert(serve(__dirname + '/../public')));
}

app.use(convert(session({
    store: redisStore({
        client: configureRedis()
    }),
    key: "kitty.sid"
})));

app.use(cacheMiddleware());

app.use(bodyParser());

app.use(methodOverride((req) => {
    if (req.body && (typeof req.body === 'object') && ('_method' in req.body)) {
        // look in urlencoded POST bodies and delete it
        const method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// pretty JSON response middleware
app.use(convert(json()));

app.use(convert(logger()));
// views with pug
app.use(views(__dirname + '/views', { extension: 'pug' }));
// csrf
app.use(new CSRF());

app.use(router.routes(), router.allowedMethods());

app.listen(config.port, function() {
    console.log(`Example app listening on port ${config.port}!`);
});

export default app;

import Koa from 'koa';
import Csrf from 'koa-csrf';
import views from 'koa-views';
import convert from 'koa-convert';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import methodOverride from 'koa-methodoverride';
import logger from 'koa-logger';
import serve from 'koa-static';
import mount from 'koa-mount';
import config from '../config';
import routes from './routes';
import passport from './auth';
import session from './middlewares/session';
import RedisStore from './connect_client/redis';
import cacheMiddleware from './middlewares/cache';

const app = new Koa();
// use for cookie signature
app.keys = [config.secretKeyBase];

// serve static file in same server when deploy
if (config.serveStatic) {
    app.use(mount('/static', serve(__dirname + '/../public')));
}

app.use(session({
    store: RedisStore.connect(),
    signed: true,
    key: "kitty.sid"
}));

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

app.use(passport.initialize());
app.use(routes);

// views with pug
app.use(views(__dirname + '/views', { extension: 'pug' }));
// csrf
app.use(new Csrf());

app.listen(config.port, () => {
    console.log(`kitty is listening on port ${config.port}!`);
});

export default app;

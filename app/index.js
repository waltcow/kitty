import Koa from 'koa';
import CSRF from 'koa-csrf';
import views from 'koa-views';
import convert from 'koa-convert';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import methodOverride from 'koa-methodoverride';
import logger from 'koa-logger';
import serve from 'koa-static';
import config from '../config';
import router from './routes';
import session from './middlewares/session';
import RedisStore from './connect_client/redis';
import cacheMiddleware from './middlewares/cache';

const app = new Koa();
// use for cookie signature
app.keys = [config.secretKeyBase];

// not serve static when deploy
if (config.serveStatic){
    app.use(convert(serve(__dirname + '/../public')));
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
// views with pug
app.use(views(__dirname + '/views', { extension: 'pug' }));
// csrf
app.use(new CSRF());

app.use(router.routes(), router.allowedMethods());

app.listen(config.port, () => {
    console.log(`kitty is listening on port ${config.port}!`);
});

export default app;

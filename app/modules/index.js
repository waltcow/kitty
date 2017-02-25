import Router from 'koa-router'
import fs from 'fs'
import path from 'path'

const basename = path.basename(module.filename);

function initModules(app) {
    fs.readdirSync(__dirname).filter((file) => {
        return file !== basename;
    }).forEach((mod) => {
        const { routes, baseUrl } = require(`./${mod}/router`);
        const instance = new Router({ prefix: baseUrl });
        routes.forEach((config) => {
            const { method = '', route = '', handlers = [] } = config;
            const lastHandler = handlers.pop();
            instance[method.toLowerCase()](route, ...handlers, async function(ctx) {
                return await lastHandler(ctx)
            });
            app.use(instance.routes()).use(instance.allowedMethods())
        })
    })
}

export default initModules;

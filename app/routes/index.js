import fs from 'fs';
import path from 'path';
import Router from 'koa-router';
import home from '../controllers/home';
import passport from '../controllers/auth';

const basename = path.basename(module.filename);
const router = Router();

// register all routes in current path folder
fs.readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function(file) {
        let route = require(path.join(__dirname, file));
        router.use(route.routes(), route.allowedMethods());
    });

router.get('/', home.index);
router.get('/auth', passport.authenticate());

export default router;

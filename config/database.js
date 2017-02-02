
var database = {
    development: {
        username: process.env.DATABASE_USERNAME_DEV || 'kitty_dev',
        password: process.env.DATABASE_PASSWORD_DEV || 'kitty_dev',
        database: process.env.DATABASE_NAME_DEV || 'kitty_dev',
        host: process.env.DATABASE_HOST_DEV || 'demo.waltcow.com',
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    },
    test: {
        username: process.env.DATABASE_USERNAME_TEST || 'kitty_test',
        password: process.env.DATABASE_PASSWORD_TEST || 'kitty_tester',
        database: process.env.DATABASE_NAME_TEST || 'kitty_tester',
        host: process.env.DATABASE_HOST_TEST || 'demo.waltcow.com',
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    },
    production: {
        username: process.env.DATABASE_USERNAME_PRO,
        password: process.env.DATABASE_PASSWORD_PRO,
        database: process.env.DATABASE_NAME_PRO,
        host: process.env.DATABASE_HOST_PRO,
        dialect: 'postgres',
        pool: {
            max: 10,
            min: 5,
            idle: 30000
        }
    }
};

module.exports = database;

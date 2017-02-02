# Kitty

A Web App written with Koa2, Webpack and Postgres.

This project is like Ruby on Rails Project:

* MVC
* Database (postgres), ORM(sequelize)
* migration(sequelize-cli)
* assets compile(webpack)
* Session with redis
* Password with bcrypt
* Testing (mocha)
* Lint (eslint)
* middleware
* console
* server side render with react

## How to Install

```bash
 install nodejs
 install redis and postgres
 create postgres database:
 for development { database: 'kitty_dev', owner: 'kitty_dev', password: 'kitty_dev' }
 for test { database: 'kitty_test', owner: 'kitty_tester', password: 'kitty_tester' }
 clone this project
```


## Structure

```
├── app
│   ├── assets
│   │   ├── images
│   │   ├── javascripts
│   │   └── stylesheets
│   ├── controllers
│   ├── helpers
│   ├── models
│   ├── routes
│   ├── services
│   ├── views
│   └── index.js
├── config
│   ├── config.js
│   └── webpack
│       ├── base.js
│       ├── development.js
│       └── production.js
├── db
│   └── migrations
├── index.js
├── package.json
├── public
└── test
```
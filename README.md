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
 for development { database: 'kails_dev', owner: 'kails_dev', password: 'kails_dev' }
 for test { database: 'kails_test', owner: 'kails_tester', password: 'kails_tester' }
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
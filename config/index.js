import merge from "lodash/merge";
import development from "./development";
import production from "./production";
import test from "./test";
import dbConfig from "./database";

let env = process.env.NODE_ENV || 'development';

let configs = {
    development: development,
    test: test,
    production: production
};

let defaultConfig = { env: env };
let database = { database: dbConfig[env] };

const config = merge(defaultConfig, configs[env]);
export { config as default, database }


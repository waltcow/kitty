import merge from "lodash/merge";
import development from "./development";
import production from "./production";
import test from "./test";
import path from "path"

let env = process.env.NODE_ENV || 'development';

let configs = {
    development: development,
    test: test,
    production: production
};

let defaultConfig = {
    env: env,
    root: path.normalize(__dirname + '/..')
};

const config = merge(defaultConfig, configs[env]);

export default config;


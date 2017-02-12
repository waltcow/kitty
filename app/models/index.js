import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { database as config } from '../../config';

const basename = path.basename(module.filename);
const models = {};
let sequelizeClient  = new Sequelize(config.database, config.username, config.password, config);

// read all models and import them into the "db" object
fs.readdirSync(__dirname)
    .filter(function(file) {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function(file) {
        var model = sequelizeClient.import(path.join(__dirname, file));
        models[model.name] = model;
    });

Object.keys(models).forEach(function(modelName) {
  if (models[modelName].associate) {
      models[modelName].associate(models);
  }
});

models.sequelize = sequelizeClient;
models.Sequelize = Sequelize;

export default models;

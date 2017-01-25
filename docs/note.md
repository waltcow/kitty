# How to auto generate migrations with Sequelize CLI from Sequelize models?

```js
sequelize model:create --name MyUser --attributes first_name:string,last_name:string,bio:text
```

```js
"use strict";
module.exports = function(sequelize, DataTypes) {
  var MyUser = sequelize.define("MyUser", {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    bio: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return MyUser;
};
```

```js
"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("MyUsers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      first_name: {
        type: DataTypes.STRING
      },
      last_name: {
        type: DataTypes.STRING
      },
      bio: {
        type: DataTypes.TEXT
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("MyUsers").done(done);
  }
};
```


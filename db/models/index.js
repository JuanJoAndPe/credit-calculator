const { User, UserSchema } = require('./user.model');

function setUpModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));

  // foreing keys associations
  User.associate(sequelize.models);
}

module.exports = setUpModels;

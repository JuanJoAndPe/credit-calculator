const { User, UserSchema } = require('./user.model'),
  { Request, RequestSchema } = require('./request.model');

function setUpModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Request.init(RequestSchema, Request.config(sequelize));

  // foreing keys associations
  User.associate(sequelize.models);
  Request.associate(sequelize.models);
}

module.exports = setUpModels;

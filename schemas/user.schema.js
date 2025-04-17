const Joi = require('joi').extend(require('@joi/date')),
  { joiPasswordExtendCore } = require('joi-password'),
  JoiPassword = Joi.extend(joiPasswordExtendCore);

const id = Joi.number().integer().min(1),
  name = Joi.string().min(1).trim(),
  lastName = Joi.string().min(1).trim(),
  email = Joi.string().email().lowercase(),
  password = JoiPassword.string()
    .minOfSpecialCharacters(2)
    .minOfLowercase(2)
    .minOfUppercase(2)
    .minOfNumeric(2)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .doesNotInclude([
      'admin',
      'ADMIN',
      'Admin',
      'password',
      'PASSWORD',
      'Password',
      '1234',
      '4321',
      'pass',
      'PASS',
      'Pass',
    ]),
  recoveryToken = Joi.string().token(),
  role = Joi.string().trim().valid('hr', 'admin', 'employee');

const createUserSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  email: email.required(),
  password: password.required(),
  role: role,
});

const updateUserSchema = Joi.object({
  name: name,
  lastName: lastName,
  email: email,
  password: password,
  role: role,
});

const getUserSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
};

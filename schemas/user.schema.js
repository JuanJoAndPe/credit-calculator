const Joi = require('joi').extend(require('@joi/date')),
  { joiPasswordExtendCore } = require('joi-password'),
  JoiPassword = Joi.extend(joiPasswordExtendCore);

const id = Joi.number().integer().min(1),
  departmentId = Joi.number().integer().min(1),
  name = Joi.string().min(1).trim(),
  lastName = Joi.string().min(1).trim(),
  birthdate = Joi.date().format('YYYY-MM-DD').raw(),
  email = Joi.string().email().lowercase(),
  password = JoiPassword.string()
    .minOfSpecialCharacters(2)
    .minOfLowercase(2)
    .minOfUppercase(2)
    .minOfNumeric(2)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .doesNotInclude([
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
  role = Joi.string().trim().valid('hr', 'admin', 'employee'),
  startDate = Joi.date().format('YYYY-MM-DD').raw(),
  separationDate = Joi.date()
    .format('YYYY-MM-DD')
    .raw()
    .min(Joi.ref('startDate')),
  vacationDays = Joi.number().integer().min(0),
  isActive = Joi.boolean();

const createUserSchema = Joi.object({
  departmentId: departmentId.required(),
  name: name.required(),
  lastName: lastName.required(),
  birthdate: birthdate.required(),
  email: email.required(),
  password: password.required(),
  role: role,
  startDate: startDate.required(),
  separationDate: separationDate,
  vacationDays: vacationDays,
  isActive: isActive,
});

const updateUserSchema = Joi.object({
  departmentId: departmentId,
  name: name,
  lastName: lastName,
  birthdate: birthdate,
  email: email,
  password: password,
  role: role,
  startDate: startDate,
  separationDate: separationDate,
  vacationDays: vacationDays,
  isActive: isActive,
});

const getUserSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
};

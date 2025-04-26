const Joi = require('joi');

const id = Joi.number().integer().min(1),
  userId = Joi.number().integer().greater(0),
  productType = Joi.string()
    .min(3)
    .trim()
    .valid('vehicular', 'consumo', 'microcredito', 'inmobiliario'),
  amount = Joi.number().greater(0).precision(2),
  loanTerm = Joi.number().integer().greater(0),
  identificationType = Joi.string().max(1).default('C'),
  identification = Joi.string().pattern(
    new RegExp('(^[0-9]{10}$)|(^[0-9]{10}001$)'),
  ),
  status = Joi.string()
    .trim()
    .valid('casado/a', 'union libre', 'soltera/a', 'viudo/a', 'separado/a'),
  separationOfProperty = Joi.boolean().when('status', {
    switch: [
      { is: 'casado/a', then: Joi.required() },
      { is: 'separado/a', then: Joi.required() },
    ],
    otherwise: Joi.optional(),
  }),
  income = Joi.number().greater(0).precision(2),
  otherIncome = Joi.number().min(0).precision(2).default(0),
  outcome = Joi.number().min(0).precision(2).default(0),
  assets = Joi.number().min(0).precision(2).default(0),
  spouseIdentificationType = Joi.string()
    .max(1)
    .when('status', {
      switch: [
        { is: 'casado/a', then: Joi.required().valid('C') },
        { is: 'separado/a', then: Joi.required().valid('C') },
      ],
      otherwise: Joi.optional(),
    }),
  spouseIdentification = Joi.string()
    .pattern(new RegExp('^[0-9]{10}$'))
    .when('status', {
      switch: [
        { is: 'casado/a', then: Joi.required() },
        { is: 'separado/a', then: Joi.required() },
      ],
      otherwise: Joi.optional(),
    }),
  spouseIncome = Joi.number()
    .min(0)
    .precision(2)
    .when('status', {
      switch: [
        { is: 'casado/a', then: Joi.required() },
        { is: 'separado/a', then: Joi.required() },
      ],
      otherwise: Joi.optional(),
    }),
  numberOfChildren = Joi.number().integer().min(0).default(0);

const createRequestSchema = Joi.object({
  productType: productType.required(),
  amount: amount.required(),
  loanTerm: loanTerm.required(),
  identificationType: identificationType.required(),
  identification: identification.required(),
  status: status.required(),
  separationOfProperty: separationOfProperty,
  income: income.required(),
  otherIncome: otherIncome,
  outcome: outcome,
  assets: assets,
  spouseIdentificationType: spouseIdentificationType,
  spouseIdentification: spouseIdentification,
  spouseIncome: spouseIncome,
  numberOfChildren: numberOfChildren,
});

const getRequestSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createRequestSchema,
  getRequestSchema,
};

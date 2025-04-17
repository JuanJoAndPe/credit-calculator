const express = require('express');
const passport = require('passport');

const RequestsService = require('../services/request.service'),
  validatorHandler = require('../middlewares/validator.handler'),
  // also you can use a library called access control to manage who is allowed to do anything
  { checkRoles } = require('../middlewares/auth.handler'),
  { createRequestSchema } = require('../schemas/request.schema');

const router = express.Router();
const service = new RequestsService();

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  // checkRoles('admin', 'hr'),
  validatorHandler(createRequestSchema, 'body'),
  async (req, res, next) => {
    try {
      const data = req.body,
        { value } = createRequestSchema.validate(data, { abortEarly: false }),
        body = value,
        newRequest = await service.create(body);
      res.status(201).json(newRequest);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;

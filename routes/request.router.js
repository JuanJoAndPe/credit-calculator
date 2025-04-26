const express = require('express');
const passport = require('passport');

const RequestsService = require('../services/request.service'),
  validatorHandler = require('../middlewares/validator.handler'),
  // also you can use a library called access control to manage who is allowed to do anything
  { checkRoles } = require('../middlewares/auth.handler'),
  {
    createRequestSchema,
    getRequestSchema,
  } = require('../schemas/request.schema');

const router = express.Router();
const service = new RequestsService();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const request = await service.find();
      res.json(request);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getRequestSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const request = await service.findOne(id);
      res.status(200).json(request);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  // checkRoles('admin', 'seller'),
  validatorHandler(createRequestSchema, 'body'),
  async (req, res, next) => {
    try {
      const data = req.body,
        user = req.user,
        { value } = createRequestSchema.validate(data, { abortEarly: false }),
        body = value,
        newRequest = await service.create(body, user.sub);
      res.status(201).json(newRequest);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;

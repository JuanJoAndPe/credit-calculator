const express = require('express');
const passport = require('passport');

const UsersService = require('../services/user.service'),
  validatorHandler = require('../middlewares/validator.handler'),
  // also you can use a library called access control to manage who is allowed to do anything
  { checkRoles } = require('../middlewares/auth.handler'),
  {
    createUserSchema,
    updateUserSchema,
    getUserSchema,
  } = require('../schemas/user.schema');

const router = express.Router();
const service = new UsersService();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = await service.find();
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.findOne(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'hr'),
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const data = req.body,
        { value } = createUserSchema.validate(data, { abortEarly: false }),
        body = value,
        newUser = await service.create(body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'hr'),
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params,
        data = req.body,
        { value } = updateUserSchema.validate(data, { abortEarly: false }),
        body = value,
        user = await service.update(id, body);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'hr'),
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params,
        user = await service.delete(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;

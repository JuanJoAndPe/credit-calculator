const express = require('express');
const passport = require('passport');

const userRouter = require('./user.router'),
  requestRouter = require('./request.router'),
  authRouter = require('./auth.router');

function routerApi(app) {
  const router = express.Router();
  app.use(passport.initialize());
  app.use('/api/v1', router);

  router.use('/users', userRouter);
  router.use('/auth', authRouter);
  router.use('/requests', requestRouter);
}

module.exports = routerApi;

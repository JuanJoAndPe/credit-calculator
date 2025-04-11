const express = require('express');
const passport = require('passport');

const userRouter = require('./user.router');

function routerApi(app) {
  const router = express.Router();
  app.use(passport.initialize());
  app.use('/api/v1', router);

  router.use('/users', userRouter);
}

module.exports = routerApi;

const { config } = require('./../config/config');

module.exports = {
  development: {
    url: config.dbUrl,
    dialect: 'postgres',
    dialectOptions: { useUTC: false },
  },
  production: {
    url: config.dbUrl,
    dialect: 'postgres',
    dialectOptions: {
      useUTC: false,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};

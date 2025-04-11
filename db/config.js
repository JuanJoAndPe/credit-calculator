const { config } = require('./../config/config');

module.exports = {
  development: {
    url: config.dbUrl,
    dialect: 'postgres',
    dialectOptions: { useUTC: false },
    timezone: 'America/Guayaquil',
  },
  production: {
    url: config.dbUrl,
    dialect: 'postgres',
    timezone: 'America/Guayaquil',
    dialectOptions: {
      useUTC: false,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};

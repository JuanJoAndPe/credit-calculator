const { Sequelize } = require('sequelize');
const { config } = require('./../config/config');
const setUpModels = require('./../db/models');

const logginOptions = config.isProd ? false : console.log;

const options = {
  dialect: 'postgres',
  logging: logginOptions,
  timezone: 'America/Guayaquil', // This ensures correct writing
  dialectOptions: {
    useUTC: false, // Prevents automatic conversion to UTC
  },
};

if (config.isProd) {
  options.dialectOptions = {
    useUTC: false, // for reading from database
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

const sequelize = new Sequelize(config.dbUrl, options);

// for mysql
// const USER = encodeURIComponent(config.msUser);
// const PASSWORD = encodeURIComponent(config.dbPassword);

// URL mysql database connection
// const URI = `mysql://${USER}:${PASSWORD}@${config.dbHost}:${config.msPort}/${config.dbName}`;

// const sequelize = new Sequelize(URI, {
//   dialect: 'mysql',
//   logging: true
// });

setUpModels(sequelize);

module.exports = sequelize;

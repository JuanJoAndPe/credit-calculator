'use strict';

const { config } = require('./config/config'),
  { USER_TABLE } = require('./../models/user.model'),
  { REQUEST_TABLE } = require('./../models/request.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      USER_TABLE,
      [
        {
          name: 'John',
          last_name: 'Doe',
          email: 'john.doe@company.com',
          password: config.dummyPassword,
          role: 'admin',
        },
        {
          name: 'Mike',
          last_name: 'Myers',
          email: 'mike.myers@company.com',
          password: config.dummyPassword,
          role: 'hr',
        },
        {
          name: 'Ana',
          last_name: 'Towers',
          email: 'ana.towers@company.com',
          password: config.dummyPassword,
          role: 'employee',
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(REQUEST_TABLE, null, {});
    await queryInterface.bulkDelete(USER_TABLE, null, {});
  },
};

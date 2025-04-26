'use strict';

const { DataTypes, Sequelize } = require('sequelize');

const { USER_TABLE } = require('./../models/user.model'),
  { REQUEST_TABLE } = require('./../models/request.model');

module.exports = {
  up: async (queryInterface) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable(USER_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        field: 'last_name',
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      recoveryToken: {
        field: 'recovery_token',
        allowNull: true,
        type: DataTypes.STRING,
      },
      role: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: ['admin', 'hr', 'employee'],
        defaultValue: 'employee',
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(REQUEST_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        field: 'user_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: USER_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      productType: {
        field: 'product_type',
        allowNull: false,
        type: DataTypes.ENUM,
        values: ['vehicular', 'consumo', 'microcredito', 'inmobiliario'],
        defaultValue: 'consumo',
      },
      amount: {
        allowNull: false,
        type: DataTypes.DECIMAL(10, 2),
      },
      loanTerm: {
        field: 'loan_term',
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      identificationType: {
        field: 'identification_type',
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: 'C',
      },
      identification: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: [
          'casado/a',
          'unio libre',
          'soltero/a',
          'viudo/a',
          'separado/a',
        ],
        defaultValue: 'soltero/a',
      },
      separationOfProperty: {
        field: 'separation_of_property',
        allowNull: true,
        type: DataTypes.BOOLEAN,
      },
      income: {
        allowNull: false,
        type: DataTypes.DECIMAL(10, 2),
      },
      otherIncome: {
        field: 'other_income',
        allowNull: true,
        type: DataTypes.DECIMAL(10, 2),
      },
      outcome: {
        allowNull: true,
        type: DataTypes.DECIMAL(10, 2),
      },
      assets: {
        allowNull: true,
        type: DataTypes.DECIMAL(10, 2),
      },
      spouseIdentificationType: {
        field: 'spouse_identification_type',
        allowNull: true,
        type: DataTypes.STRING,
      },
      spouseIdentification: {
        field: 'spouse_identification',
        allowNull: true,
        type: DataTypes.STRING,
      },
      spouseIncome: {
        field: 'spouse_income',
        allowNull: true,
        type: DataTypes.DECIMAL(10, 2),
      },
      numberOfChildren: {
        field: 'number_of_children',
        allowNull: true,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.sequelize.query(`
      alter table ${USER_TABLE}
      alter column created_at set default now(),
      alter column updated_at set default now();


      alter table ${REQUEST_TABLE}
      alter column created_at set default now(),
      alter column updated_at set default now();
    `);
  },

  down: async (queryInterface) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable(RESERVATION_TABLE);
    await queryInterface.dropTable(USER_TABLE);
  },
};

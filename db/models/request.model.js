const { Model, DataTypes, Sequelize } = require('sequelize');

const REQUEST_TABLE = 'requests';

const RequestSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  userId: {
    field: 'user_id',
    allowNull: false,
    type: DataTypes.INTEGER
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
    defaultValue: 'C'
  },
  identification: {
    allowNull: false,
    type: DataTypes.STRING
  },
  status: {
    allowNull: false,
    type: DataTypes.ENUM,
    values: ['casado/a', 'unio libre', 'soltero/a', 'viudo/a', 'separado/a'],
    defaultValue: 'soltero/a',
  },
  separationOfProperty: {
    field: 'separation_of_property',
    allowNull: true,
    type: DataTypes.BOOLEAN
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
    defaultValue: 0
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
};

class Request extends Model {
  static associate(models) {
    // models
    this.belongsTo(models.User, { as: 'user' });

    /*
    this.hasMany(models.WorkDay, {
      as: 'work_day',
      foreignKey: 'userId',
    });
    */
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: REQUEST_TABLE,
      modelName: 'Request',
      timestamps: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}

module.exports = {
  REQUEST_TABLE,
  RequestSchema,
  Request,
};

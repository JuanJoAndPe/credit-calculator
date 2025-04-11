const { Model, DataTypes, Sequelize } = require('sequelize');

const USER_TABLE = 'users';

const UserSchema = {
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
};

class User extends Model {
  static associate(models) {
    // models
    /* this.belongsTo(models.Department, { as: 'department' });
    // this.belongsTo(models.Status, { as: 'status' });

    this.hasMany(models.Request, {
      as: 'request',
      foreignKey: 'userId',
    });

    this.hasMany(models.Reservation, {
      as: 'reservation',
      foreignKey: 'userId',
    });

    this.hasMany(models.WorkDay, {
      as: 'work_day',
      foreignKey: 'userId',
    }); */
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}

module.exports = {
  USER_TABLE,
  UserSchema,
  User,
};

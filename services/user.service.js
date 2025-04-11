const boom = require('@hapi/boom');
const { models } = require('./../libs/sequelize');
const bcrypt = require('bcrypt');

class UsersService {
  constructor() {}

  async create(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = await models.User.create({
      ...data,
      password: hash,
    });
    delete newUser.dataValues.password;
    delete newUser.dataValues.recoveryToken;
    return newUser;
  }

  async find() {
    const response = await models.User.findAll({
      attributes: { exclude: ['password', 'recoveryToken', 'department_id'] },
    });
    return response;
  }

  async findByEmail(email) {
    const response = await models.User.findOne({
      where: { email: email, isActive: true },
      attributes: ['id', 'email', 'password', 'name', 'lastName', 'role'],
    });
    return response;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id, {
      attributes: { exclude: ['password', 'recoveryToken', 'department_id'] },
      include: {
        model: models.Department,
        as: 'department',
        attributes: { exclude: ['id', 'isActive', 'createdAt', 'updatedAt'] },
      },
    });
    if (!user) {
      throw boom.notFound('user not found');
    } else {
      return user;
    }
  }

  async findForRecovery(id) {
    const user = await models.User.findByPk(id, {
      attributes: ['id', ['recovery_token', 'recoveryToken']],
      where: { isActive: true },
    });
    if (!user) {
      throw boom.notFound('user not found');
    } else {
      return user;
    }
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    const response = await user.update(changes);
    return response;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }
}

module.exports = UsersService;

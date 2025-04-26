const boom = require('@hapi/boom');
const { models } = require('./../libs/sequelize');

class RequestsService {
  constructor() {}

  async create(data, userId) {
    const newData = { ...data, userId: userId };
    const newRequest = await models.Request.create(newData);
    return newRequest;
  }

  async find() {
    const response = await models.Request.findAll();
    return response;
  }

  async findOne(id) {
    const request = await models.Request.findByPk(id, {
      attributes: { exclude: ['user_id'] },
      include: [
        {
          model: models.User,
          as: 'user',
          attributes: {
            exclude: [
              'id',
              'createdAt',
              'updatedAt',
              'password',
              'recoveryToken',
              'role',
            ],
          },
        },
      ],
    });
    if (!request) {
      throw boom.notFound('request not found');
    } else {
      return request;
    }
  }

  async findRequestsByUserId(id) {
    const requests = await models.Request.findAll({
      where: {
        userId: id,
      },
      attributes: { exclude: ['user_id'] },
      include: [
        {
          model: models.User,
          as: 'user',
          attributes: {
            exclude: [
              'id',
              'createdAt',
              'updatedAt',
              'password',
              'recoveryToken',
              'role',
            ],
          },
        },
      ],
    });
    return requests;
  }
}

module.exports = RequestsService;

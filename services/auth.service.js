const UsersService = require('./user.service'),
  boom = require('@hapi/boom'),
  bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken'),
  { config } = require('./../config/config'),
  service = new UsersService(),
  nodemailer = require('nodemailer'),
  expirationTime = 5;

class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw boom.unauthorized();
      } else {
        delete user.dataValues.password;
        return user;
      }
    }
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: `${expirationTime}m`,
    });
    return {
      user,
      token,
    };
  }

  async sendRecovery(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    } else {
      const payload = { sub: user.id },
        token = jwt.sign(payload, config.jwtRecoverySecret, {
          expiresIn: `${expirationTime}m`,
        }), // could be a different secret so it adds an extra layer of security to the app
        link = `http://myfrontend.com/recovery?token=${token}`,
        mail = {
          from: `"${config.emailUser}" <${config.emailUser}>`, // sender address
          to: `${user.email}`, // list of receivers
          subject: 'Recover your password ✔', // Subject line
          // text: 'Hello!',
          html: `<p><b>Click this link to recover your password:</b></p>
          <p>${link}</p>
          <p>This link will expire in ${expirationTime} minutes.</p>`, // html body
        };
      await service.update(user.id, { recoveryToken: token });
      const rta = await this.sendMail(mail);
      return rta;
    }
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtRecoverySecret);
      const user = await service.findForRecovery(payload.sub);
      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      } else {
        const hash = await bcrypt.hash(newPassword, 10);
        await service.update(user.id, { password: hash, recoveryToken: null });
        return { message: 'password has been changed' };
      }
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async sendMail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: config.emailHost,
      port: config.emailPort,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.emailUser, // generated ethereal user
        pass: config.emailPassword, // generated ethereal password
      },
    });
    await transporter.sendMail(infoMail);
    return { message: 'mail sent' };
  }
}

module.exports = AuthService;

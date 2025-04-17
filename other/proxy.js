const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Usuarios (en producciÃ³n deberÃ­an estar en una base de datos)
const users = [
  {
    id: 1,
    username: process.env.ADMIN_USER || 'admin',
    passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10),
    role: 'admin',
  },
  {
    id: 2,
    username: process.env.ANALYST_USER || 'analista',
    passwordHash: bcrypt.hashSync(
      process.env.ANALYST_PASSWORD || 'analista123',
      10,
    ),
    role: 'analyst',
  },
];

// Middleware de autenticaciÃ³n
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key',
      (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        req.user = user;
        next();
      },
    );
  } else {
    res.sendStatus(401);
  }
};

// Ruta de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Usuario no encontrado' });
  }

  if (!bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'ContraseÃ±a incorrecta' });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' },
  );

  res.json({ token });
});

// Proteger la ruta del proxy con autenticaciÃ³n
app.post('/proxy', authenticateJWT, async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Request body is empty' });
    }

    const response = await axios.post(
      'https://api-test.avalburo.com/services/V8/getWebService',
      req.body,
      {
        headers: {
          Authorization:
            'Basic ' + Buffer.from('WSTEST-MAXC:YC^1#I8P@V').toString('base64'),
          'Content-Type': 'application/json',
        },
        // Add timeout and response validation
        timeout: 10000,
        responseType: 'json',
        validateStatus: function (status) {
          return status >= 200 && status < 300; // Only resolve for 2xx statuses
        },
      },
    );

    if (!response.data) {
      throw new Error('Empty response from external API');
    }

    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);

    let statusCode = 500;
    let errorMessage = error.message;

    if (error.response) {
      // The request was made and the server responded with a status code
      statusCode = error.response.status;
      errorMessage = error.response.data || error.message;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from external API';
    }

    res.status(statusCode).json({
      error: errorMessage,
      details: error.config?.url
        ? `Failed to call ${error.config.url}`
        : undefined,
    });
  }
});

// Ruta protegida de ejemplo
app.get('/protected', authenticateJWT, (req, res) => {
  res.json({
    message: `Hola ${req.user.username}, tienes rol ${req.user.role}`,
  });
});

app.listen(3000, () => console.log('Servidor proxy corriendo en puerto 3000'));

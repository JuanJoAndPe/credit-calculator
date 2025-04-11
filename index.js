const express = require('express'),
  routerApi = require('./routes'),
  cors = require('cors'),
  { config } = require('./config/config'),
  { checkApiKey } = require('./middlewares/auth.handler');

const {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
} = require('./middlewares/error.handler');

const app = express();

//routing with express
app.use(express.json());

//white list for CORS
const whiteList = [`http://localhost:${config.port}`, 'https://myapp.co'];
const options = {
  origin: (origin, callback) => {
    if (whiteList.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not granted'));
    }
  },
};
// use cors
app.use(cors(options));

// import utilities
require('./utils/auth');

routerApi(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.get('/', checkApiKey, (req, res) => {
  res.send(`Environment: ${config.env}`);
});

app.listen(config.port, () => {
  console.info(
    `App environment ${config.env} listening on port ${config.port} ${new Date()}`,
  );
});

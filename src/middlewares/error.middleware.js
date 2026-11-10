const env = require('../config/env');

// handled de erros
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || err.statusCode || 500;
  const message =
    env.NODE_ENV === 'production' && status >= 500
      ? 'Erro interno do servidor'
      : err.message;

  res.status(status).send(message);
}

module.exports = errorHandler;

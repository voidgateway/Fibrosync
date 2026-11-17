const express = require('express');
const { ASSETS_DIR } = require('./config/paths');
const routes = require('./routes');
const notFound = require('./middlewares/not-found.middleware');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Assets compartilhados (imagens, tokens.css).
// As páginas usam ../../assets/... (relativo à pasta da página no disco).
// Servidas em /<pagina>/, esse caminho sobe até a raiz e vira /assets/...
app.use('/assets', express.static(ASSETS_DIR));

app.use(routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

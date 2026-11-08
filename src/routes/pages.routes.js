const express = require('express');
const { VIEWS_DIR } = require('../config/paths');
const notFound = require('../middlewares/not-found.middleware');

const router = express.Router();

// views/404 só deve aparecer como resposta de erro. Acessada direto,
// responde com status 404 em vez de 200 (evita "soft 404").
// Só o HTML é bloqueado: o /404/style.css continua sendo servido.
router.get(['/404', '/404/index.html'], notFound);

// A landing page usa caminhos relativos (style.css, ../cadastro/...),
// então ela precisa ser aberta dentro da própria pasta.
router.get('/', (req, res) => {
  res.redirect('/landing-page/');
});

// Cada pasta em public/views vira uma página:
//   /landing-page/          -> public/views/landing-page/index.html
//   /cadastro/              -> public/views/cadastro/index.html
//   /login-paciente/        -> public/views/login-paciente/index.html
//   /dados-complementares/  -> public/views/dados-complementares/index.html
//   /dashboard/             -> public/views/dashboard/index.html
// Os style.css e script.js de cada pasta são servidos junto.
router.use(express.static(VIEWS_DIR));

module.exports = router;

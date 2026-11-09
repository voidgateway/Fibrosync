const express = require('express');
const pagesRoutes = require('./pages.routes');

const router = express.Router();

// Rotas da API entram aqui, antes das páginas. 
// router.use('/api/auth', require('./auth.routes'));
router.use('/api/pacientes', require('./pacientes.routes'));

router.use(pagesRoutes);

module.exports = router;

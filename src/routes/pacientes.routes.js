const express = require('express');
const pacientesController = require('../controllers/pacientes.controller');

// rotas de /api/pacientes
const router = express.Router();

router.post('/', pacientesController.cadastrar);
router.post('/login', pacientesController.login);
router.post('/senha/link', pacientesController.pedirLinkDeSenha);
router.get('/senha/:token', pacientesController.conferirLinkDeSenha);
router.post('/senha', pacientesController.trocarSenha);
router.get('/:id', pacientesController.buscar);

module.exports = router;

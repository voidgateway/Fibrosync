const express = require('express');
const pacientesController = require('../controllers/pacientes.controller');

// rotas de /api/pacientes
const router = express.Router();

router.post('/login', pacientesController.login);

module.exports = router;

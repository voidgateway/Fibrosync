const express = require('express');
const pacientesController = require('../controllers/pacientes.controller');

// rotas de /api/pacientes
const router = express.Router();

router.post('/login', pacientesController.login);
router.get('/:id', pacientesController.buscar);

module.exports = router;

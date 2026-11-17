const express = require('express');
const climaController = require('../controllers/clima.controller');

// rotas de /api/clima
const router = express.Router();

router.get('/', climaController.atual);
router.get('/cidades', climaController.cidades);
router.get('/automatica', climaController.automatica);

module.exports = router;

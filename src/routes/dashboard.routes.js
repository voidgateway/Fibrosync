const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');

// rotas de /api/dashboard
const router = express.Router();

router.get('/', dashboardController.resumo);

module.exports = router;

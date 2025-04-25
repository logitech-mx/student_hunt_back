// routes/applicationRoutes.js
const express = require('express');
const { createApplication, checkApplicationStatus } = require('../controllers/applicationController');
const authenticateJWT = require('../middleware/auth');

const router = express.Router();

// Маршрут для создания отклика
router.post('/', authenticateJWT, createApplication);

// Новый маршрут для проверки статуса отклика
router.get('/:jobId/status', authenticateJWT, checkApplicationStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const { createScenario, getScenarios } = require('../controllers/scenarioController');
const { protect } = require('../middleware/authMiddleware'); // assuming protective auth token parsing

router.use(protect); // Secure all scenario routes

router.post('/create', createScenario);
router.get('/', getScenarios);

module.exports = router;

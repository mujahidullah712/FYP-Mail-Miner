const express = require('express');
const router = express.Router();
const { googleAuth, logout } = require('../controllers/authController');

router.get('/google', googleAuth);
router.post('/logout', logout);

module.exports = router;
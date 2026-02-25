const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   POST /api/auth/logout
router.post('/logout', logout);

module.exports = router;

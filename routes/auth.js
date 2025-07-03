const express = require('express');
const router = express.Router();
const { validateUser } = require('../middleware/validators');
const { register, login, logout } = require('../controllers/authController');
const { refreshToken } = require('../utils/token');

router.post('/register', validateUser, register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/refresh', refreshToken);

module.exports = router;
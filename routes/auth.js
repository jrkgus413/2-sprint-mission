const express = require('express');
const router = express.Router();
const { validateUser } = require('../middleware/validators');
const { register, login, logout } = require('../controllers/authController');

router.post('/register', validateUser, register);

router.post('/login', login);

router.post('/logout', logout);

module.exports = router;
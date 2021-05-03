var express = require('express');
var router = express.Router();
const AuthController = require('../app/controllers/auth/AuthController');
const authMiddleware = require('../app/middlewares/authMiddleware');

router.get('/register', AuthController.getRegister)

router.post('/register', authMiddleware.register, AuthController.postRegister)

// GET /auth/login
router.get('/login', AuthController.getLogin)

// POST /auth/login
router.post('/login', authMiddleware.login, AuthController.postLogin)

module.exports = router
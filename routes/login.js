const express = require('express');
const router = express.Router();
const LoginController = require('../app/controllers/auth/LoginController');

// [GET] /login
router.get('/', LoginController.index);

module.exports = router;

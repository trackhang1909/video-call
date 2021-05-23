const express = require('express')
const router = express.Router()
const HomeController = require('../app/controllers/HomeController')
const authMiddleware = require('../app/middlewares/authMiddleware')

// [GET] /
router.get('/', HomeController.index);
// [GET] /call
router.get('/call', HomeController.call);
// [GET] /account-detail
router.get('/account-detail', authMiddleware.isLogged, HomeController.accountDetail);

module.exports = router;

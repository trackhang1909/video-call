const express = require('express');
const router = express.Router();
const HomeController = require('../app/controllers/HomeController');

// [GET] /
router.get('/', HomeController.index);
// [GET] /call
router.get('/call', HomeController.call);
// [GET] /account-detail
router.get('/account-detail', HomeController.accountDetail);

module.exports = router;

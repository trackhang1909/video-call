const express = require('express')
const NotificationController = require('../app/controllers/NotificationController')
const router = express.Router()
const UserController = require('../app/controllers/UserController')
const authMiddleware = require('../app/middlewares/authMiddleware')


// [POST] /
router.post('/seen/:toId?', authMiddleware.isLogged, NotificationController.seenNotify)
// router.post('/cancel-request/:toId?', authMiddleware.isLogged, UserController.cancelRequest)

module.exports = router;

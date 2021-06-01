const express = require('express')
const router = express.Router()
const UserController = require('../app/controllers/UserController')
const authMiddleware = require('../app/middlewares/authMiddleware')

// [POST] /
router.post('/request/:toId?', authMiddleware.isLogged, UserController.sendRequest)
router.post('/cancel-request/:toId?', authMiddleware.isLogged, UserController.cancelRequest)
router.post('/accept/:toId?', authMiddleware.isLogged, UserController.acceptRequest)
router.post('/decline/:toId?', authMiddleware.isLogged, UserController.declineRequest)
router.post('/unfriend/:toId?', authMiddleware.isLogged, UserController.unfriend)

module.exports = router;

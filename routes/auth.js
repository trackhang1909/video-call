var express = require('express')
var router = express.Router()
const AuthController = require('../app/controllers/auth/AuthController')
const authMiddleware = require('../app/middlewares/authMiddleware')
const passport = require('passport')

// GET /auth/register
router.get('/register', AuthController.getRegister)

// POST /auth/register
router.post('/register', authMiddleware.register, AuthController.postRegister)

// GET /auth/login
router.get('/login', AuthController.getLogin)

// POST /auth/login
router.post('/login', authMiddleware.login, AuthController.postLogin)

// Get Facebook auth
router.get(
    '/facebook',
    passport.authenticate(
        'facebook',
        { scope: ['email', 'user_photos', 'user_gender'] }
    )
)

// Get Facebook callback
router.get(
    // url
    '/facebook/callback',
    // middleware
    passport.authenticate(
        'facebook',
        { failureRedirect: '/auth/login', }
    ),
    // controller
    AuthController.facebookAuth
)

// Get Google auth
router.get(
    '/google',
    passport.authenticate(
        'google',
        { scope: ['profile', 'email'] }
    )
)

// Get Google callback
router.get(
    // url
    '/google/callback',
    // middleware
    passport.authenticate(
        'google',
        { failureRedirect: '/auth/login' }
    ),
    // controller
    AuthController.googleAuth
)

// Log out
router.get('/logout', AuthController.logout)

module.exports = router
const { validationResult } = require('express-validator');
const User = require('../../models/User')
const saltRounds = 10;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class AuthController {
    // [GET] auth/register
    getRegister(req, res) {
        let error = req.flash('error') || ''
        let success = req.flash('success') || ''
        let username = req.flash('username') || ''
        let email = req.flash('email') || ''
        let fullname = req.flash('fullname') || ''

        res.render('auth/register', { error, success, username, email, fullname })
    }

    // [POST] auth/register  
    postRegister(req, res, next) {
        // get result of validation
        let result = validationResult(req)

        // Get email, username
        let email = req.body.email
        let username = req.body.username
        let fullname = req.body.fullname

        // if validation success
        if (result.errors.length === 0) {
            const hash_password = bcrypt.hashSync(req.body.password, saltRounds);

            // create user data to store
            var user_data = {
                username: username,
                email: email,
                password: hash_password,
                fullname: fullname,
                photo_url: '/picture/avatar-png-default.png'
            }

            // save user
            User.create(user_data)
                .then(() => {
                    // flash data
                    req.flash("success", 'Đăng ký tài khoản thành công.')
                    return res.redirect('/auth/register')
                })
                .catch(error => {
                    // if username duplicate
                    if (error.code === 11000 && error.keyValue.username != undefined) {
                        // flash data
                        req.flash("error", 'Tên người dùng đã tồn tại, vui lòng thử lại.')
                        req.flash('username', username)
                        req.flash('email', email)
                        req.flash('fullname', fullname)
                    }
                    // if email duplicate
                    else if (error.code === 11000 && error.keyValue.email != undefined) {
                        // flash data
                        req.flash("error", 'Email đã tồn tại, vui lòng thử lại.')
                        req.flash('username', username)
                        req.flash('email', email)
                        req.flash('fullname', fullname)
                    }
                    return res.redirect('/auth/register')
                })
        }

        // if validation fail
        else {
            result = result.mapped();

            let msg;
            let fields

            // save first message error
            for (fields in result) {
                msg = result[fields].msg
                break
            }

            // flash data
            req.flash("error", msg)
            req.flash('username', username)
            req.flash('email', email)
            req.flash('fullname', fullname)

            return res.redirect('/auth/register')

        }
    }

    // [GET] auth/login  
    getLogin(req, res, next) {
        let error = req.flash('error') || ''
        let username = req.flash('username') || ''

        res.render('auth/login', { error, username });

    }

    // [POST] auth/login  
    postLogin(req, res, next) {
        // get result of validation
        let result = validationResult(req)

        // get username / password from form
        let username = req.body.username
        let password = req.body.password

        console.log(result);
        // if validation success
        if (result.errors.length === 0) {

            // find user from database by username
            User.findOne({ username: username })
                .then(user => {
                    // if username exist
                    if (user) {
                        // compare form password vs user password in database
                        bcrypt.compare(password, user.password, function (error, result) {
                            // if it has error return message error
                            if (error) {
                                // flash data 
                                let msg = error
                                req.flash("error", msg)
                                req.flash('username', username)

                                return res.redirect('/auth/login')
                            }
                            // if it success:
                            // -> generate user token
                            // -> redirect index page
                            if (result) {
                                // generate user token
                                let token = jwt.sign({ id: user._id, username: user.username }, 'secret', { expiresIn: '1h' })

                                // store token in httpOnly
                                res.cookie('token', token, {
                                    maxAge: 300000,
                                    httpOnly: true,
                                })

                                // redirect to index page
                                return res.redirect('/')
                            }
                            // if user password not match
                            else {
                                // flash data
                                let msg = 'Tên người dùng hoặc mật khẩu không đúng'
                                req.flash("error", msg)
                                req.flash('username', username)

                                return res.redirect('/auth/login')
                            }
                        })
                    }
                    // if user not exist
                    else {
                        // flash data
                        let msg = 'Tên người dùng không tồn tại'
                        req.flash("error", msg)
                        req.flash('username', username)

                        return res.redirect('/auth/login')
                    }
                })
        }
        // if validation fail
        else {
            result = result.mapped();
            let msg
            let fields

            // save first message error
            for (fields in result) {
                msg = result[fields].msg;
                break;
            }

            // flash data
            req.flash("error", msg)

            return res.redirect('/auth/login')
        }
    }

    // Facebook Authorize
    facebookAuth(req, res, next) {
        // create token
        let token = jwt.sign({ id: req.user._id }, 'secret', { expiresIn: '1h' })

        // store token in httpOnly
        res.cookie('token', token, {
            // maxAge: 300000,
            httpOnly: true,
        })

        // redirect to index page
        return res.redirect('/')
    }

    // Google Authorize
    googleAuth(req, res, next) {
        // create token
        let token = jwt.sign({ id: req.user._id }, 'secret', { expiresIn: '1h' })

        // store token in httpOnly
        res.cookie('token', token, {
            httpOnly: true,
        })

        // redirect to index page
        return res.redirect('/')
    }

    // Log out
    logout(req, res, next) {
        res.cookie('token', '', { expires: new Date(0) })
        req.flash('isLogged', false)
        return res.redirect('/')
    }
}

module.exports = new AuthController();
const { verify } = require("jsonwebtoken");
const User = require("../models/User");



const title = 'Home Page';

class HomeController {
    // [GET] /
    index = async (req, res) => {
        const token = req.cookies.token

        let isLogged = req.flash('isLogged') || false

        if (token) {
            isLogged = req.flash('isLogged', true)

            let payload = verify(token, 'secret')
            let userId = payload.id

            let user = await User.findById(userId)

            return res.render('index', { title, isLogged, user });
        }
        return res.render('index', { title, isLogged });
    }
    // [GET] /call
    call(req, res) {
        res.render('call', { title });
    }
    // [GET] /account-detail
    accountDetail(req, res) {
        res.render('account-detail', { title });
    }

    login(req, res) {
        res.render('auth/login');
    }
    register(req, res) {
        res.render('auth/register');
    }
}

module.exports = new HomeController();

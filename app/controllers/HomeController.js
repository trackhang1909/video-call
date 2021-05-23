const { verify } = require("jsonwebtoken");
const User = require("../models/User");



const title = 'Home Page';

class HomeController {
    // [GET] /
    index = async (req, res) => {
        const token = req.cookies.token

        let isLogged = req.flash('isLogged') || falses

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
    accountDetail = async (req, res) => {
        const token = req.cookies.token

        let isLogged = req.flash('isLogged') || falses

        if (token) {
            isLogged = req.flash('isLogged', true)

            let payload = verify(token, 'secret')
            let userId = payload.id

            let user = await User.findById(userId).populate('list_friends')

            // list friends of current user
            let list_friends = user.list_friends

            // list all user
            let list_user = await User.find({})

            // get user not friends of current user
            let list_suggest = list_user.filter(element =>
                // if not match
                !list_friends.some(d => d.id == element.id)
            );

            console.log(list_suggest);

            return res.render('account-detail', { title, isLogged, user, list_suggest });
        }
        return res.render('account-detail', { title, isLogged });
    }

    login(req, res) {
        res.render('auth/login');
    }
    register(req, res) {
        res.render('auth/register');
    }
}

module.exports = new HomeController();

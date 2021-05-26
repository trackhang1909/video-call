const { verify } = require("jsonwebtoken");
const Suggest = require("../models/Suggest");
const User = require("../models/User");

let title

class HomeController {
    // [GET] /
    index = async (req, res) => {
        title = 'Trang chủ'
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
                !list_friends.some(d => d.id == element.id)
            );
            list_suggest = list_suggest.filter(element => element.id !== userId)

            for await (let element of list_suggest) {
                let requestToUser = await User.findById(element.id);
                let data = [{
                    id_user: user,
                    request_to: requestToUser,
                    status: 0
                }];

                let request = await Suggest.findOne({ $and: [{ id_user: user }, { request_to: requestToUser }] });

                if (request) {
                    if (request.status != 1) {
                        await Suggest.findOneAndUpdate({ $and: [{ id_user: user }, { request_to: requestToUser }] }, { status: 0 });
                    }
                    console.log('skip');
                } else {
                    await Suggest.create(data);
                    console.log('create');
                }
            }

            // list suggest friends
            list_suggest = await Suggest.find({ id_user: user }).populate('request_to')

            title = user.fullname

            return res.render('account-detail', { title, isLogged, user, list_suggest, });
        }
        return res.render('account-detail', { isLogged });
    }
}

module.exports = new HomeController();

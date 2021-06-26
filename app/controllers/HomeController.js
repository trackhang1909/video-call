const { verify } = require("jsonwebtoken");
const Notification = require("../models/Notification");
const Suggest = require("../models/Suggest");
const User = require("../models/User");
const CallLog = require("../models/CallLog");

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
            global.userId = userId

            let user = await User.findById(userId)

            let list_notification = await Notification.findOne({ id_user: user }).populate('request_from.user')

            return res.render('index', { title, isLogged, user, list_notification });
        }
        return res.render('index', { title, isLogged });
    }
    // [GET] /call
    async call(req, res) {
        const user = req.query.callToId ? await User.findById(req.query.callToId).lean() : await User.findById(req.query.callFromId).lean();
        const fullname = user ? user.fullname : 'User' ;
        res.render('call', { title, fullname });
    }
    // [GET] /account-detail
    accountDetail = async (req, res) => {
        const token = req.cookies.token

        let isLogged = req.flash('isLogged') || falses

        if (token) {

            isLogged = req.flash('isLogged', true)

            let payload = verify(token, 'secret')
            let userId = payload.id
            global.userId = userId

            let callLogs = await CallLog.find({ call_from: userId }).populate('call_to').lean();
            for await (let e of callLogs) {
                e.createdAt = e.createdAt.getDate() + '/' + (e.createdAt.getMonth() + 1) + '/' + e.createdAt.getFullYear() + ' - ' + e.createdAt.getHours() + ':' + e.createdAt.getMinutes();
            }

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
                    if (request.status != 1 && request.status != 2) {
                        await Suggest.findOneAndUpdate({ $and: [{ id_user: user }, { request_to: requestToUser }] }, { status: 0 })
                    }
                } else {
                    await Suggest.create(data);
                }
            }

            let list_notification = await Notification.findOne({ id_user: user }).populate('request_from.user')

            // get list friends request
            if (list_notification) {
                for await (let element of list_notification.request_from) {
                    let toUser = await User.findById(element.user.id)

                    await Suggest.findOneAndUpdate({ $and: [{ id_user: user }, { request_to: toUser }] }, { status: 2 })
                }
            }

            // list suggest friends
            list_suggest = await Suggest.find({ id_user: user }).populate('request_to')

            title = user.fullname

            return res.render('account-detail', { title, isLogged, user, list_suggest, list_notification, userId, callLogs });
        }
        return res.render('account-detail', { isLogged });
    }
}

module.exports = new HomeController();

const { verify } = require("jsonwebtoken");
const Notification = require("../models/Notification");
const Suggest = require("../models/Suggest");
const User = require("../models/User");
const CallLog = require("../models/CallLog");
const { validationResult } = require('express-validator');
const saltRounds = 10;
const bcrypt = require('bcrypt')

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

    changePasswordGet = async (req, res) => {
        title = 'Đổi mật khẩu'
        let error = req.flash('error') || ''
        let success = req.flash('success') || ''
        const token = req.cookies.token

        let isLogged = req.flash('isLogged') || false

        if (token) {
            isLogged = req.flash('isLogged', true)

            let payload = verify(token, 'secret')
            let userId = payload.id
            global.userId = userId

            let user = await User.findById(userId)

            let list_notification = await Notification.findOne({ id_user: user }).populate('request_from.user')

            return res.render('change-password', { title, isLogged, user, list_notification, error, success });
        }
        return res.render('change-password', { title, isLogged });
    }

    changePasswordPost = async (req, res) => {
        title = 'Đổi mật khẩu'
        // get result of validation
        let result = validationResult(req)

        // get password / confirm_password from form
        let password = req.body.password
        let userId = req.body.user_id

        // if validation success
        if (result.errors.length === 0) {
            const hash_password = bcrypt.hashSync(password, saltRounds);

            await User.findByIdAndUpdate(userId, { password: hash_password })

            req.flash("success", 'Đổi mật khẩu thành công.')
            return res.redirect('/change-password')
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

            req.flash("error", msg + '.')
            return res.redirect('/change-password')
        }
    }
}

module.exports = new HomeController();

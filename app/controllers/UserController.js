const Notification = require("../models/Notification");
const Suggest = require("../models/Suggest");
const User = require("../models/User");

class HomeController {
    // [POST] /user/request/:toId
    sendRequest = async (req, res) => {
        // Get data from client
        let toId = req.params.toId
        let fromId = req.body.fromId

        // Get user by id
        let toUser = await User.findById(toId)
        let fromUser = await User.findById(fromId)

        // Get list notification
        let list_notification = await Notification.findOne({ id_user: toUser }).populate('request_from.user')

        // Update status suggest
        await Suggest.findOneAndUpdate({ $and: [{ id_user: fromUser }, { request_to: toUser }] }, { status: 1 })

        if (list_notification) {
            let contain = false
            for await (let element of list_notification.request_from) {
                if (element.user.id != fromUser.id) {
                    contain = false
                } else {
                    contain = true
                    break
                }
            }
            // Update request notification
            if (!contain) {
                await Notification.findOneAndUpdate(
                    { id_user: toUser },
                    { $push: { request_from: { user: fromUser, status: 'new' } } }
                )
            }
        } else {
            // if notification not exist 
            let dataNotification = {
                id_user: toId,
                request_from: [{ user: fromUser, status: 'new' }],
            }

            // => create notification
            await Notification.create(dataNotification);
        }

        let toUserData = await Notification.findOne({ id_user: toUser }).populate('request_from.user')

        return res.json({
            success: true,
            data: toUserData
        })
    }

    // [POST] /user/cancel-request/:toId
    cancelRequest = async (req, res) => {
        // Get data from client
        let toId = req.params.toId
        let fromId = req.body.fromId

        // Get user by id
        let toUser = await User.findById(toId)
        let fromUser = await User.findById(fromId)

        // Get list notification
        let list_notification = await Notification.findOne({ id_user: toUser }).populate('request_from.user')

        // Renew list suggest
        await Suggest.findOneAndUpdate({ $and: [{ id_user: fromUser }, { request_to: toUser }] }, { status: 0 })

        if (list_notification) {
            for await (let element of list_notification.request_from) {
                if (element.user.id == fromUser.id) {
                    // Remove request
                    await Notification.findOneAndUpdate({ id_user: toUser }, { $pull: { request_from: { user: fromUser } } })

                    // Renew list suggest
                    await Suggest.findOneAndUpdate({ $and: [{ id_user: toUser }, { request_to: fromUser }] }, { status: 0 })
                    break
                }
            }

            let toUserData = await Notification.findOne({ id_user: toUser })

            // Update success
            return res.json({
                success: true,
                data: toUserData
            })
        } else {

            return res.json({
                success: false
            })
        }
    }

    acceptRequest = async (req, res, next) => {
        // Get data from client
        let toId = req.params.toId
        let userId = req.body.userId

        let toUser = await User.findById(toId)
        let user = await User.findById(userId)

        // add user to list friends and remove notification
        await Suggest.findOneAndDelete({ id_user: toUser, request_to: user })
        await Suggest.findOneAndDelete({ id_user: user, request_to: toUser })
        await User.findByIdAndUpdate(userId, { $push: { list_friends: toUser } })
        await User.findByIdAndUpdate(toId, { $push: { list_friends: user } })
        await Notification.findOneAndUpdate({ id_user: user }, { $pull: { request_from: { user: toUser } } })

        return res.json({
            success: true
        })
    }

    declineRequest = async (req, res, next) => {
        // Get data from client
        let toId = req.params.toId
        let userId = req.body.userId

        let toUser = await User.findById(toId)
        let user = await User.findById(userId)

        // remove notification
        await Suggest.findOneAndUpdate({ $and: [{ id_user: user }, { request_to: toUser }] }, { status: 0 })

        await Suggest.findOneAndUpdate({ $and: [{ id_user: toUser }, { request_to: user }] }, { status: 0 })

        await Notification.findOneAndUpdate({ id_user: user }, { $pull: { request_from: { user: toUser } } })

        return res.json({
            success: true
        })
    }

    unfriend = async (req, res, next) => {
        // Get data from client
        let toId = req.params.toId
        let userId = req.body.userId

        let toUser = await User.findById(toId)
        let user = await User.findById(userId)

        // add user to list friends and remove notification
        await Suggest.findOneAndDelete({ id_user: toUser, request_to: user })
        await Suggest.findOneAndDelete({ id_user: user, request_to: toUser })
        await User.findByIdAndUpdate(userId, { $pull: { list_friends: toId } })
        await User.findByIdAndUpdate(toId, { $pull: { list_friends: userId } })
        await Notification.findOneAndUpdate({ id_user: user }, { $pull: { request_from: { user: toUser } } })

        return res.json({
            success: true
        })
    }
}

module.exports = new HomeController();

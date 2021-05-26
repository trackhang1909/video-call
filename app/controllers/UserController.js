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
        let list_notification = await Notification.findOne({ id_user: toUser }).populate('request_from')

        console.log(toId);
        console.log(list_notification);

        // Update status suggest
        await Suggest.findOneAndUpdate({ $and: [{ id_user: fromUser }, { request_to: toUser }] }, { status: 1 })

        if (list_notification) {
            let contain = false
            for await (let element of list_notification.request_from) {
                if (element.id != fromUser.id) {
                    contain = false
                } else {
                    contain = true
                    break
                }
            }
            // Update request notification
            if (!contain) {
                await Notification.findOneAndUpdate({ id_user: toUser }, { $push: { request_from: fromUser } })
            }
        } else {
            // if notification not exist 
            let dataNotification = {
                id_user: toId,
                request_from: [fromUser]
            }

            // => create notification
            await Notification.create(dataNotification);
        }

        let toUserData = await Notification.findOne({ id_user: toUser })

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
        let list_notification = await Notification.findOne({ id_user: toUser }).populate('request_from')

        // Renew list suggest
        await Suggest.findOneAndUpdate({ $and: [{ id_user: fromUser }, { request_to: toUser }] }, { status: 0 })

        if (list_notification) {
            for await (let element of list_notification.request_from) {
                if (element.id == fromUser.id) {
                    // Remove request
                    await Notification.findOneAndUpdate({ id_user: toUser }, { $pull: { request_from: fromUser.id } })

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
}

module.exports = new HomeController();

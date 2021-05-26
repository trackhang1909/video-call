const Notification = require("../models/Notification");
const Suggest = require("../models/Suggest");
const User = require("../models/User");

class HomeController {
    // [POST] /user/request/:toId
    sendRequest = async (req, res) => {
        let toId = req.params.toId
        console.log('to' + toId);

        let fromId = req.body.fromId

        let toUser = await User.findById(toId)
        let fromUser = await User.findById(fromId)

        await Suggest.findOneAndUpdate({ $and: [{ id_user: fromUser }, { request_to: toUser }] }, { status: 1 })

        // let dataNotification = [{
        //     id_user: toUser,
        //     request_from: [fromUser]
        // }]

        // let dataRequest = [{
        //     id_user: fromUser,
        //     request_from: toUser
        // }]

        // Notification.create(dataNotification)
        // Request.create(dataRequest)

        return res.json({
            success: true
        })
    }

    // [POST] /user/cancel-request/:toId
    cancelRequest = async (req, res) => {
        let toId = req.params.toId
        console.log('to' + toId);

        let fromId = req.body.fromId

        let toUser = await User.findById(toId)
        let fromUser = await User.findById(fromId)

        await Suggest.findOneAndUpdate({ $and: [{ id_user: fromUser }, { request_to: toUser }] }, { status: 0 })

        // let dataNotification = [{
        //     id_user: toUser,
        //     request_from: [fromUser]
        // }]

        // let dataRequest = [{
        //     id_user: fromUser,
        //     request_from: toUser
        // }]

        // Notification.create(dataNotification)
        // Request.create(dataRequest)

        return res.json({
            success: true
        })
    }
}

module.exports = new HomeController();

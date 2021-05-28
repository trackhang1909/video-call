const Notification = require("../models/Notification");
const Suggest = require("../models/Suggest");
const User = require("../models/User");

class NotificationController {
    // [POST] /notify/seen/:toId
    seenNotify = async (req, res) => {
        // Get data from client
        let userId = req.params.toId

        let user = await User.findById(userId)

        let list_notification = await Notification.findOne({ id_user: user }).populate('request_from.user')

        if (list_notification) {
            for await (let element of list_notification.request_from) {
                element.status = 'seen'
            }

            list_notification.save()
        }

        return res.json({
            success: true
        })

    }
}

module.exports = new NotificationController();

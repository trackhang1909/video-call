const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = new Schema({
    id_user: {
        type: Schema.Types.ObjectId, ref: 'User',
    },
    request_from: [
        {
            type: Schema.Types.ObjectId, ref: 'User',
        }
    ]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Notification', Notification);
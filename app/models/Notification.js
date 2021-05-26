const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = new Schema({
    id_user: {
        type: Schema.Types.ObjectId, ref: 'User',
        unique: true
    },
    request_from: [
        {
            type: Schema.Types.ObjectId, ref: 'User',
            unique: true
        }
    ]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Notification', Notification);
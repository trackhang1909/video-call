const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CallLog = new Schema({
    call_from: { type: Schema.Types.ObjectId, ref: 'User' },
    call_to: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Call_Log', CallLog);
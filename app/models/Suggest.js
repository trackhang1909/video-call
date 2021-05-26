const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Suggest = new Schema({
    id_user: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    request_to: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    status: {
        type: Number
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Suggest', Suggest);
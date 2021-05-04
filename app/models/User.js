const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        require: true,
        trim: true,
    },
    fullname: {
        type: String,
    },
    password: {
        type: String,
    },
    photo_url: {
        type: String,
    },
    auth_id: {
        type: String,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', User);
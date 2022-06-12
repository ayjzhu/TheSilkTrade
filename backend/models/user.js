const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    image: {
        type: Buffer,
        required: true
    },
    contentType: {
        type: String,
        required: true
    }
});

const UserSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    authId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    profilePicture: {
        required: false,
        type: ImageSchema
    },
    about: {
        type: String,
        required: false
    }
});

module.exports = Item = mongoose.model('user', UserSchema, "users");
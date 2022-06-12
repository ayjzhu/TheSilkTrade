const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    commenterId: {
        type: String,
        required: true
    },
    clotheId: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = Item = mongoose.model('comment', CommentSchema, "clothingcomments");
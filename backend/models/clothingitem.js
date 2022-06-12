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

const ClothingItemSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    sellerId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    isForRent: {
        type: Boolean,
        required: true
    },
    rating: {
        type: [String],
        required: false,
        default: []
    },
    pictures: {
        type: [ImageSchema],
        required: false
    }
}, { timestamps: true });

const BoughtItemSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    sellerId: {
        type: String,
        required: true,
    },
    purchaserId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    pictures: {
        type: [ImageSchema],
        required: false
    }
}, { timestamps: true });

const RentItemSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    sellerId: {
        type: String,
        required: true,
    },
    renterId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    pictures: {
        type: [ImageSchema],
        required: false
    }
}, { timestamps: true });

module.exports = {
    ClothingItemModel: mongoose.model('clothing', ClothingItemSchema, "clothing"),
    BoughtItemModel: mongoose.model('boughtclothing', BoughtItemSchema, "boughtclothing"),
    RentItemModel: mongoose.model('rentedclothing', RentItemSchema, "rentedclothing"),
}
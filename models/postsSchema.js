const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: String,
    comment: String
});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    date: {
        type: Date,
        required: true
    },
    reviews: [reviewSchema]
});

module.exports = postSchema;

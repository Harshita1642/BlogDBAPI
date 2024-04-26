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
    image: String,
    date: {
        type: Date,
        default: Date.now
    },
    reviews: [reviewSchema]
});

module.exports = postSchema;

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
        default: ""
    },
    date: {
        type: Date,
        required: true
    },
    reviews: [reviewSchema],
    likes: {
        type: Number,
        default: 0
    },
    chosentemplate: {
        type: Number,
        default: 0
    }
});

module.exports = postSchema;
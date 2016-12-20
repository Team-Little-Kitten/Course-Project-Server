"use strict";

const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name: String,
    threads: [{
        title: String,
        content: String,
        author: {
            username: String,
            _id: String
        },
        dateOfCreation: Date,
        category: { type: String, enum: ["User Suggestions", "Comment Authors", "Lessons", "Write a Book Review", "Fun"] },
        comments: [{
            content: String,
            author: {
                username: String,
                _id: String
            },
            dateOfCreation: Date
        }]
    }]
});

module.exports = mongoose.model("category", categorySchema);

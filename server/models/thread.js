"use strict";

const mongoose = require("mongoose");

const thread = mongoose.Schema({
    title: { type: String, unique: false },
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
});

const Thread = mongoose.model("thread", thread, "threads");
module.exports = Thread;
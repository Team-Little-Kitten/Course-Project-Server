"use strict";

const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
    isRead: { type: Boolean, default: false },
    sentOn: { type: Date, default: Date.now },
    readOn: { type: Date, default: null },
    sender: {
        username: String,
        _id: String
    },
    reciver: {
        username: String,
        _id: String
    },
    text: { type: String }
});

const Notification = mongoose.model("notification", notificationSchema, "notifications");
module.exports = Notification;
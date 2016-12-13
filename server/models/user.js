const mongoose = require("mongoose");

let User = mongoose.model("user", {
    firstname: String,
    lastname: String,
    username: { type: String, unique: true },
    password: String
});
module.exports = User;
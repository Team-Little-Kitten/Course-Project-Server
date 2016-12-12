const mongoose = require("mongoose");

let User = mongoose.model("user", {});
module.exports = User;
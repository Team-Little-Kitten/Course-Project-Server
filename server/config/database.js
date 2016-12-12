"use strict";

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
module.exports = config => {
    mongoose.createConnection(config.connectionString);
};
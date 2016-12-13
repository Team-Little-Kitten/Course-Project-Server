"use strict";

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
module.exports = config => {
    mongoose.connect(config.connectionString)
        .then(console.log)
        .catch(console.log);
};
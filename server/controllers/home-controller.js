"use strict";

module.exports = function () {
    return {
        loadHomePage(req, res) {
            res.json(JSON.stringify({ "array": "arrrraaay" }))
        }
    };
};
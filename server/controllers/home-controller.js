"use strict";

module.exports = () => {
    return {
        loadHomePage(req, res) {
            res.json(JSON.stringify({ "array": "arrrraaay" }))
        }
    };
};
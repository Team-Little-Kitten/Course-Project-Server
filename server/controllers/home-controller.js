"use strict";

module.exports = () => {
    return {
        loadHomePage(req, res) {
            console.log(req.user);
            res.json(JSON.stringify({ "array": "arrrraaay" }))
        }
    };
};
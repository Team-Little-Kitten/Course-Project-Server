"use strict";

module.exports = () => {
    return {
        loadHomePage(req, res) {
            console.log(req.user);
            res.json(JSON.stringify({ "array": "arrrraaay" }))
        },
        test(req, res) {
            console.log(req.user)
            res.json(req.user);
        }
    };
};
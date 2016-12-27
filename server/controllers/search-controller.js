"use strict";

const User = require("../models/user");
const LiteraryPiece = require("../models/literary-piece");

module.exports = () => {
    return {
        searchUserAndLiteraryPieces(req, res) {
            let searchValue = req.body.searchValue;
            let regex = new RegExp(searchValue, "i")
            User.find({ username: regex }, (err, users) => {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: err.toString() });
                }

                LiteraryPiece.find({ title: regex }, (error, literaryPieces) => {
                    if (error) {
                        console.log(error);
                        return res.json({ success: false, message: error.toString() });
                    }

                    res.json({
                        success: true,
                        result: { users, literaryPieces }
                    });
                });
            });
        }
    };
};
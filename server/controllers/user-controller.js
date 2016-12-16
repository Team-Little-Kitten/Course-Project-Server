"use strict";

const User = require("../models/user");

module.exports = () => {
    return {
        getSingleUserData(req, res) {
            let id = req.params.id;
            User.findById(id, (err, user) => {
                if (err) console.log(err);
                if (!user) return res.json({ success: false, message: "User not found." });
                return res.json({
                    success: true,
                    user: {
                        username: user.username,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        _id: user._id
                    }
                });
            });
        }
    };
};
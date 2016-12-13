"use strict";

const User = require("../models/user");

module.exports = () => {
    return {
        registerUser(req, res) {
            let body = req.body;
            User.findOne({ username: body.username }, (err, user) => {
                if (err) {
                    res.json(err);
                    return;
                }

                if (user) {
                    res.json({ message: `User with username "${body.username}" already exists.` });
                    return;
                }

                User.create(body, (error, result) => {
                    if (error) {
                        res.json(error);
                        return;
                    }

                    res.json(result);
                });
            })
        }
    };
};
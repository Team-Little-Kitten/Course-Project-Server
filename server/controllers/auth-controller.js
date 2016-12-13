"use strict";

const User = require("../models/user");
const passport = require("passport");

function localAuthentication(req, res) {
    return (err, userModel) => {
        if (err) {
            return err;
        }

        if (!userModel) {
            return res.json("{\"error\": \"Invalid username or password.\"}");
        }

        req.login(userModel, error => {
            if (error) {
                console.log(error);
                return res.json("{\"error\": \"Invalid username or password.\"}");
            }

            return res.json(userModel);
        });
    };
}

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
        },
        loginUser(req, res, next) {
            passport.authenticate("local", localAuthentication(req, res))(req, res, next);
        }
    };
};
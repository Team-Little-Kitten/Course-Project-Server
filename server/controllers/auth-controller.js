"use strict";

const User = require("../models/user");
const passport = require("passport");
const encryption = require("../utils/encryption");

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
                return res.json("{\"error\": \"Invalid username or password.\"}");
            }

            let salt = encryption.getSalt();
            let authToken = encryption.getPassHash(salt, userModel.username);

            User.findOneAndUpdate({ username: userModel.username }, { authToken }, () => {
                req.user.authToken = authToken;
                return res.json({
                    username: req.user.username,
                    firstname: req.user.firstname,
                    lastname: req.user.lastname,
                    _id: req.user._id,
                    authToken: req.user.authToken
                });
            });
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

                let salt = encryption.getSalt();
                let passHash = encryption.getPassHash(salt, body.password);
                body.salt = salt;
                body.passHash = passHash;
                User.create(body, (error, result) => {
                    if (error) {
                        res.json(error);
                        return;
                    }

                    res.json({
                        username: result.username,
                        firstname: result.firstname,
                        lastname: result.lastname,
                        _id: result._id
                    });
                });
            })
        },
        loginUser(req, res, next) {
            passport.authenticate("local", localAuthentication(req, res))(req, res, next);
        },
        logoutUser(req, res) {
            req.logout();
            res.sendStatus(200);
        },
        verifyLogin(req, res) {
            let authToken = req.body.authToken;

            if (!req.user || req.user.authToken !== authToken) {
                res.json({ isLoggedIn: false });
                return;
            }

            res.json({ isLoggedIn: true });
        }
    };
};
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
                    result: {
                        username: user.username,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        _id: user._id,
                        about: user.about,
                        signature: user.signature,
                        imageDataUrl: user.imageDataUrl
                    }
                });
            });
        },
        updateUserData(req, res) {
            let body = req.body;
            let updateObject = {};

            if (body.about) updateObject.about = body.about;
            if (body.signature) updateObject.signature = body.signature;
            if (body.imageDataUrl) updateObject.imageDataUrl = body.imageDataUrl;

            User.findByIdAndUpdate(req.params.id, updateObject, (err, user) => {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, message: "Error on the server. Check updateUserData() in user-controller" });
                }

                User.findById(req.params.id, (error, data) => {
                    if (error) {
                        console.log(error);
                        return res.json({ success: false, message: "Error on the server. Check updateUserData() in user-controller" });
                    }

                    res.json({
                        success: true,
                        result: {
                            username: data.username,
                            firstname: data.firstname,
                            lastname: data.lastname,
                            _id: data._id,
                            about: data.about,
                            signature: data.signature,
                            imageDataUrl: data.imageDataUrl
                        }
                    });
                });
            });
        }
    };
};
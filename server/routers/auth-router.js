"use strict";

const passport = require("passport");

function facebookCallback(req, res) {
    res.json({
        success: true,
        message: "Login successful."
    });
}

module.exports = ({ app, controllers }) => {
    app.post("/auth/register", controllers.auth.registerUser);
    app.post("/auth/login", controllers.auth.loginUser);
    app.post("/auth/logout", controllers.auth.logoutUser);
    app.post("/auth/verify", controllers.auth.verifyLogin);

    app.get("/auth/facebook", passport.authenticate("facebook"));
    app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), facebookCallback);
};
"use strict";

module.exports = ({ app, controllers }) => {
    app.post("/auth/register", controllers.auth.registerUser);
    app.post("/auth/login", controllers.auth.loginUser);
};
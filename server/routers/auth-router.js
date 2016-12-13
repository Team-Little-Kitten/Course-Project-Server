"use strict";

module.exports = ({ app, controllers }) => {
    app.post("/auth/register", controllers.auth.registerUser);
};
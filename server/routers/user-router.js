"use strict";

module.exports = ({ app, controllers }) => {
    app.get("/users/:id", controllers.user.getSingleUserData);
};
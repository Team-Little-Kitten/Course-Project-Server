"use strict";

module.exports = ({ app, controllers }) => {
    app.get("/users/all", controllers.user.getAllUsersData);
    app.get("/users/:id", controllers.user.getSingleUserData);

    app.post("/users/:id", controllers.user.updateUserData);

    app.post("/api/users/follow", controllers.user.followUser);
    app.post("/api/users/unfollow", controllers.user.unfollowUser);
};
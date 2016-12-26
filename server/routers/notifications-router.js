"use strict";

module.exports = ({ app, controllers }) => {
    let controller = controllers.notifications;

    app.get("/api/notifications", controller.notificationsStream);
};
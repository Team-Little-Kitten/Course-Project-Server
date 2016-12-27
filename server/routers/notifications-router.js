module.exports = ({ app, controllers }) => {
    app.get("/api/notifications/refresh", controllers.notifications.refreshNotification);
};
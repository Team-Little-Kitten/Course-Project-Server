module.exports = ({ app, controllers }) => {
    app.get("/api/notifications/refresh", controllers.notifications.refreshNotification);
    app.get("/api/notifications/markAsRead", controllers.notifications.markNotificationAsRead);
};
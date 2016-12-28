const User = require("./../models/user");

function getElementIndex(array, attr, value) {
    for (let i = 0; i < array.length; i += 1) {
        if (array[i][attr].toString() === value) {
            return i;
        }
    }
    return -1;
}


module.exports = () => {
    return {
        refreshNotification(req, res) {
            let username = req.query.username;

            User.findOne({ username })
                .then(foundUser => {
                    return res.json(foundUser.notifications);
                });
        },
        markNotificationAsRead(req, res) {
            let notificationId = req.query.id;
            let username = req.query.username;
            console.log(notificationId, username);
            User.findOne({ username })
                .then(user => {
                    let notifications = user.notifications;
                    let index = getElementIndex(notifications, "_id", notificationId);
                    let notificationToPush = notifications[index];
                    notificationToPush.isRead = true;
                    notificationToPush.readOn = Date.now();
                    user.notifications.splice(index, 1, notificationToPush);


                    user.save();
                });
        }
    };
};
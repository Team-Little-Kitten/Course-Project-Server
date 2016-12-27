const User = require("./../models/user");

module.exports = () => {
    return {
        refreshNotification(req, res) {
            let username = req.query.username;

            User.findOne({ username })
                .then(foundUser => {
                    return res.json(foundUser.notifications);
                });
        }
    };
};
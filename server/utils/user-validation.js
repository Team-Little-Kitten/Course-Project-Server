module.exports = {
    authenticateByToken(req, res, next) {
        if (req.user && req.body.authToken === req.user.authToken) {
            next();
        }
    }
};
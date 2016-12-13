const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

module.exports = app => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy({
        usernameField: "username",
        passwordField: "password"
    }, (username, password, done) => {
        User.findOne({ username }, (err, user) => {
            if (err) {
                console.log(err);
            } else if (!user) {
                done(null, false, { message: "Incorrect credentials." });
            } /* else if (!user.isValidPassword(password)) { <=== SHOULD VALIDATE IF THE PASSWORD MATCHES
                 done(null, false, { message: "Incorrect credentials." });
            }*/ else {
                return done(null, user);
            }

        });
    }));

    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            if (user) {
                done(null, user);
                return;
            }

            done(err, null);
        });
    });
};
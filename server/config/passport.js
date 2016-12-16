const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = app => {
    app.use(passport.initialize());
    
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        secretOrKey: 'secret',
        audience: "localhost:3000"
    }, (jwt_payload, done) => {
        User.findOne({ id: jwt_payload.sub }, (err, user) => {
            if (err) {
                return done(err, false);
            }

            if (user) {
                return done(null, user);
            }

            return done(null, false);
        });
    }));
};
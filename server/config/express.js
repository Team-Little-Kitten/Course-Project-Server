const express = require("express");
const bodyParser = require("body-parser");
const passportConfig = require("./passport");
const expressSession = require("express-session");
const cors = require("cors");

module.exports = () => {
    let app = express();

    app.options('*', cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(expressSession({
        secret: "noissessserpxe",
        resave: true,
        saveUninitialized: true
    }));
    passportConfig(app);

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    return app;
};

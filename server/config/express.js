const express = require("express");
const bodyParser = require("body-parser");
const passportConfig = require("./passport");
const expressSession = require("express-session");

module.exports = () => {
    let app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(expressSession({
        secret: "noissessserpxe",
        resave: true,
        saveUninitialized: true
    }));
    passportConfig(app);

    return app;
};

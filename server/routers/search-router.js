"use strict";

module.exports = ({ app, controllers }) => {
    app.post("/search", controllers.search.searchUserAndLiteraryPieces);
};
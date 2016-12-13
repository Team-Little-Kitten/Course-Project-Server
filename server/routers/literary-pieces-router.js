"use strict";

module.exports = ({ app, controllers }) => {
    let controller = controllers["literary-piece"]
    
    app.get("/api/pieces/all", controller.getAllPieces)
};
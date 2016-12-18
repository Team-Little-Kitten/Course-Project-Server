"use strict";

module.exports = ({ app, controllers }) => {
    let controller = controllers["literary-piece"]
    
    app.get("/api/pieces/all", controller.getAllPieces);
    app.get("/api/pieces/filtered-for-homepage", controller.getPiecesForHomepage);
    app.get("/api/pieces/byAuthor", controller.getPiecesByAuthor);
    app.get("/api/pieces/detailed/:id", controller.getPieceById);

    app.post("/api/pieces/create", controller.createPiece);
};
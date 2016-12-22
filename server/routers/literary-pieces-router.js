"use strict";

module.exports = ({ app, controllers }) => {
    let controller = controllers["literary-piece"];

    app.get("/api/pieces/all", controller.getAllPieces);
    app.get("/api/pieces/filtered-for-homepage", controller.getPiecesForHomepage);
    app.get("/api/pieces/byAuthor", controller.getPiecesByAuthor);
    app.get("/api/pieces/byId", controller.getPieceById);

    app.post("/api/pieces/create", controller.createPiece);
    app.post("/api/pieces/update", controller.updatePiece);
    app.post("/api/pieces/add-comment", controller.addComment);
    app.post("/api/pieces/like-comment", controller.likeComment);
    app.post("/api/pieces/dislike-comment", controller.dislikeComment);
};
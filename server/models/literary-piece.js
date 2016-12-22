const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let literaryPieceSchema = new Schema({
    title: { type: String, unique: true },
    subtitle: { type: String },
    genre: { type: String },
    author: { type: String },
    body: { type: String },
    imageDataUrl: { type: String }, // TODO default
    deletedOn: { type: Date, default: null },
    createdOn: { type: Date, default: Date.now },
    comments: [{
        content: String,
        author: String,
        postDate: { type: Date, default: Date.now },
        averageRating: { type: Number, default: 0 },
        likedBy: [],
        dislikedBy: []
    }],
    ratings: [{
        author: String,
        story: { type: Number, default: 0 },
        characters: { type: Number, default: 0 },
        dialogue: { type: Number, default: 0 },
        style: { type: Number, default: 0 },
        feel: { type: Number, default: 0 }
    }]
});

const LiteraryPiece = mongoose.model("literaryPiece", literaryPieceSchema, "literaryPieces");
module.exports = LiteraryPiece;
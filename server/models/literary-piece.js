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
        postDate: { type: Date, default: Date.now }
    }],
    ratings: [{
        author: String,
        story: Number,
        characters: Number,
        dialogue: Number,
        style: Number,
        feel: Number
    }]
});

const LiteraryPiece = mongoose.model("literaryPiece", literaryPieceSchema, "literaryPieces");
module.exports = LiteraryPiece;
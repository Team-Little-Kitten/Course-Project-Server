const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let literaryPieceSchema = new Schema({
    title: { type: String, unique: true },
    genre: { type: String },
    author: { type: String },
    body: { type: String },
    deletedOn: { type: Date, default: null },
    createdOn: { type: Date, default: Date.now },
    comments: [{
        content: String,
        author: String,
        postDate: { type: Date, default: Date.now }
    }]
});

const LiteraryPiece = mongoose.model("literaryPiece", literaryPieceSchema, "literaryPieces");
// let lorem = new LiteraryPiece({
//     title: "Lorem",
//     genre: "Drama",
//     author: "Sparx92",
//     body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     comments: [
//         { content: "Comment 1", author: "Sparx92" },
//         { content: "Comment 2", author: "Sparx92" }
//     ]
// })
// lorem.save();
module.exports = LiteraryPiece;
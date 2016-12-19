const LiteraryPiece = require("./../models/literary-piece");

function compareByDate(a, b) {
    if (a.createdOn > b.createdOn) {
        return -1;
    }
    if (a.createdOn < b.createdOn) {
        return 1;
    }
    return 0;
}

module.exports = () => {
    return {
        getAllPieces(req, res) {
            LiteraryPiece.find({}, (err, pieces) => {
                if (err) {
                    return res.json(err);
                }

                return res.json(pieces);
            });
        },
        createPiece(req, res) {
            let recievedPiece = req.body;
            let piece = new LiteraryPiece({
                title: recievedPiece.title,
                subtitle: recievedPiece.subtitle,
                body: recievedPiece.pieceBody,
                author: recievedPiece.author,
                genre: recievedPiece.genre
            });
            piece.save((err, result, affected) => {
                if (err) {
                    res.json({ message: { type: "error", text: err } });
                } else {
                    res.json({ message: { type: "success", text: affected } });
                }
            });
        },
        getPiecesByAuthor(req, res) {
            let author = req.query.username;
            LiteraryPiece.find({ author })
                .where("deletedOn")
                .equals(null)
                .exec((err, pieces) => {
                    if (err) {
                        return res.json(err);
                    }
                    return res.json(pieces);
                });
        },
        getPiecesForHomepage(req, res) {
            LiteraryPiece.find({}, (err, pieces) => {
                if (err) {
                    return res.json(err);
                }

                let filteredPieces = [];
                filteredPieces = pieces.sort(compareByDate).slice(0, 3);
                return res.json(filteredPieces);
            });
        },
        getPieceById(req, res) {
            let _id = req.query.id;
            LiteraryPiece.find({ _id })
                .where("deletedOn")
                .equals(null)
                .exec((err, piece) => {
                    if (err) {
                        return res.json(err);
                    }
                    return res.json(piece);
                });
        },
        updatePiece(req, res) {
            let id = req.query.id;
            let body = req.body;
            let update = {
                title: body.title,
                subtitle: body.subtitle,
                body: body.pieceBody,
                genre: body.genre
            };

            let options = { new: true };

            LiteraryPiece.findOneAndUpdate({ "_id": id }, update, options,
                (err) => {
                    if (err) {
                        res.json({ message: { type: "error", text: "Duplicate key!" } });
                    } else {
                        res.json({ message: { type: "success", text: "Successfuly saved." } });
                    }
                });
        }
    };
};
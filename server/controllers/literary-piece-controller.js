const LiteraryPiece = require("./../models/literary-piece");

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
            })
            piece.save((err, result, affected) => {
                if (err) {
                    res.json({ message: { type: "error", text: "GREDAAAAAAAAAAA" } });
                }
            });
        },
        getPiecesByAuthor(req, res) {
            let author = req.query.username
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
        }
    }
}
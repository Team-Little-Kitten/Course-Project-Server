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

function compareByRating(a, b) {
    let ratingA = 0;
    let ratingB = 0;

    for (let i = 0; i < a.comments.length; i += 1) {
        ratingA += +a.comments[i].averageRating;
    }

    for (let i = 0; i < b.comments.length; i += 1) {
        ratingA += +b.comments[i].averageRating;
    }

    ratingA /= a.comments.length;
    ratingB /= b.comments.length;

    console.log(ratingA, ratingB);
    if (ratingA > ratingB) {
        return 1;
    }
    if (ratingA < ratingB) {
        return -1;
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
            console.log(recievedPiece)
            let piece = new LiteraryPiece({
                title: recievedPiece.title,
                subtitle: recievedPiece.subtitle,
                body: recievedPiece.pieceBody,
                author: recievedPiece.author,
                genre: recievedPiece.genre,
                imageDataUrl: recievedPiece.imageDataUrl
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
            let page = req.query.page;
            let pageSize = req.query.pageSize;
            let skip = (+page - 1) * pageSize;
            let limit = +pageSize;

            console.log(req.query);
            let result = {};
            // if (err) {
            //     return res.json(err);
            // }
            // return res.json(pieces);
            let countPromise = new Promise((resolve, reject) => {
                LiteraryPiece.find({ author })
                    .where("deletedOn")
                    .equals(null)
                    .count((err, count) => {
                        if (err) {
                            reject();
                        }
                        resolve(result.count = count);
                    });
            });
            let piecePromise = new Promise((resolve, reject) => {
                LiteraryPiece.find({ author })
                    .where("deletedOn")
                    .equals(null)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdOn: -1 })
                    .exec((err, pieces) => {
                        if (err) {
                            reject();
                        }
                        resolve(result.pieces = pieces)
                    });

            });

            return Promise.all([countPromise, piecePromise])
                .then(resolved => {
                    let resultToSend = {};
                    resultToSend.count = resolved[0];
                    resultToSend.pieces = resolved[1];

                    return res.json(resultToSend);
                });
        },
        getPiecesForHomepage(req, res) {
            LiteraryPiece.find({}, (err, pieces) => {
                if (err) {
                    return res.json(err);
                }

                let filteredPiecesByDate = [];
                let filteredPiecesByRating = [];
                filteredPiecesByDate = pieces.sort(compareByDate).slice(0, 3);
                filteredPiecesByRating = pieces.sort(compareByRating).slice(0, 3);
                console.log(filteredPiecesByRating);

                return res.json({ filteredPiecesByDate, filteredPiecesByRating });
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

            if (body.imageDataUrl) {
                update.imageDataUrl = body.imageDataUrl;
            }

            let options = { new: true };

            LiteraryPiece.findOneAndUpdate({ "_id": id }, update, options,
                (err) => {
                    if (err) {
                        res.json({ message: { type: "error", text: "Duplicate key!" } });
                    } else {
                        res.json({
                            message: { type: "success", text: "Successfuly saved." }
                        });
                    }
                });
        },
        addComment(req, res) {
            let id = req.body.id;
            let newComment = {
                content: req.body.commentBody,
                author: req.body.author,
                averageRating: (+req.body.storyRating + +req.body.charactersRating + +req.body.dialogueRating + +req.body.styleRating + +req.body.feelRating) / 5
            };

            let newRating = {
                author: req.body.author,
                story: +req.body.storyRating,
                characters: +req.body.charactersRating,
                dialogue: +req.body.dialogueRating,
                style: +req.body.styleRating,
                feel: +req.body.feelRating
            };

            console.log(req.body);
            let update = {
                $push: { "comments": newComment, "ratings": newRating }
            };

            let options = { new: true };

            LiteraryPiece.findOneAndUpdate({ "_id": id }, update, options,
                (err, updatedResult) => {
                    if (err) {
                        res.json({ message: { type: "error", text: "Duplicate key!" } });
                    } else {
                        console.log(updatedResult);
                        res.json({
                            updatedComments: updatedResult.comments,
                            updatedRatings: updatedResult.ratings,
                            message: { type: "success", text: "Successfuly saved." }
                        });
                    }
                });
        }
    };
};
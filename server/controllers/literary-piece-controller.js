const LiteraryPiece = require("./../models/literary-piece");
const User = require("./../models/user");
const NotificationsService = require("./../utils/notifications-service");
const Notification = require("./../models/notification");
var createdPiece;
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

    if (ratingA > ratingB) {
        return 1;
    }
    if (ratingA < ratingB) {
        return -1;
    }
    return 0;
}

function evaluateRank(rating) {
    if (rating < 3) {
        return "Newbie";
    } else if (rating < 7) {
        return "Regular";
    } else {
        return "Master";
    }
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
                genre: recievedPiece.genre,
                imageDataUrl: recievedPiece.imageDataUrl
            });
            piece.save((err, result, affected) => {
                if (err) {
                    res.json({ message: { type: "error", text: err } });
                } else {
                    res.json({ message: { type: "success", text: affected } });
                }
                createdPiece = result;
            }).then(() => {
                let username = req.body.author;
                User.findOne({ username }, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("asdadasdasdasd", createdPiece)

                    let usersToSendNotificationTo = result.usersFollowed;

                    let notificationToPush = new Notification({
                        text: `${username} created a new piece, would like to see it?`,
                        createdPieceId: createdPiece._id
                    });
                    let update = {
                        $push: { notifications: notificationToPush }
                    };
                    let options = { safe: true, upsert: true };

                    for (let i = 0; i < usersToSendNotificationTo.length; i += 1) {

                        User.findOneAndUpdate({ "_id": usersToSendNotificationTo[i]._id, }, update, options, (error, resultt) => {
                            if (error) {
                                console.log("errrer", error);
                            }

                            console.log("resultt", resultt);
                        });
                    }
                });
            });
        },
        getPiecesByAuthor(req, res) {
            let author = req.query.username;
            let page = req.query.page;
            let pageSize = req.query.pageSize;
            let skip = (+page - 1) * pageSize;
            let limit = +pageSize;

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
                        resolve(result.pieces = pieces);
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
            let pieceAuthor = req.body.pieceAuthor;
            let averageRating = (+req.body.storyRating + +req.body.charactersRating + +req.body.dialogueRating + +req.body.styleRating + +req.body.feelRating) / 5;

            let newComment = {
                content: req.body.commentBody,
                author: req.body.author,
                averageRating: +averageRating
            };

            let newRating = {
                author: req.body.author,
                story: +req.body.storyRating,
                characters: +req.body.charactersRating,
                dialogue: +req.body.dialogueRating,
                style: +req.body.styleRating,
                feel: +req.body.feelRating
            };

            let update = {
                $push: { "comments": newComment, "ratings": newRating }
            };

            let options = { new: true };

            LiteraryPiece.findOneAndUpdate({ "_id": id }, update, options,
                (err, updatedResult) => {
                    if (err) {
                        res.json({ message: { type: "error", text: "Duplicate key!" } });
                    } else {
                        User.findOne({ "username": pieceAuthor }, (error, resultUser) => {
                            if (error) {
                                return res.json(error);
                            }

                            resultUser.writerRating += +averageRating;

                            resultUser
                                .save()
                                .then(() => {
                                    return res.json({
                                        updatedComments: updatedResult.comments,
                                        updatedRatings: updatedResult.ratings,
                                        message: { type: "success", text: "Successfuly saved." }
                                    });
                                });
                        });
                    }
                });
        },
        likeComment(req, res) {
            let pieceId = req.body.pieceId;
            let commentId = req.body.commentId;
            let username = req.body.currentUser;
            let commentAuthor = req.body.commentAuthor;

            LiteraryPiece.findOne({ "_id": pieceId },
                (err, resultedPiece) => {
                    if (err) {
                        res.json({ message: { type: "error", text: "Duplicate key!" } });
                    } else {
                        for (let i = 0; i < resultedPiece.comments.length; i += 1) {
                            if (resultedPiece.comments[i]._id == commentId) {
                                resultedPiece.comments[i].likedBy.push(username);
                                break;
                            }
                        }
                        for (let i = 0; i < resultedPiece.comments.length; i += 1) {
                            if (resultedPiece.comments[i]._id == commentId) {
                                for (let j = 0; j < resultedPiece.comments[i].dislikedBy.length; j += 1) {
                                    if (resultedPiece.comments[i].dislikedBy[j] === username) {
                                        resultedPiece.comments[i].dislikedBy.splice(j, 1);
                                        break;
                                    }
                                }
                                break;
                            }
                        }

                        resultedPiece
                            .save()
                            .then(() => {
                                User.findOne({ "username": commentAuthor }, (error, resultUser) => {
                                    if (error) {
                                        return res.json(error);
                                    }

                                    resultUser.critiqueRating += 1;
                                    resultUser.rank = evaluateRank(resultUser.critiqueRating);

                                    resultUser
                                        .save()
                                        .then(() => {
                                            return res.json({
                                                updatedComments: resultedPiece.comments,
                                                message: { type: "success", text: "Successfuly rated." }
                                            });
                                        });
                                });
                            });
                    }
                });
        },
        dislikeComment(req, res) {
            let pieceId = req.body.pieceId;
            let commentId = req.body.commentId;
            let username = req.body.currentUser;
            let commentAuthor = req.body.commentAuthor;

            LiteraryPiece.findOne({ "_id": pieceId },
                (err, resultedPiece) => {
                    if (err) {
                        res.json({ message: { type: "error", text: "Duplicate key!" } });
                    } else {
                        for (let i = 0; i < resultedPiece.comments.length; i += 1) {
                            if (resultedPiece.comments[i]._id == commentId) {
                                resultedPiece.comments[i].dislikedBy.push(username);
                                break;
                            }
                        }

                        for (let i = 0; i < resultedPiece.comments.length; i += 1) {
                            if (resultedPiece.comments[i]._id == commentId) {
                                for (let j = 0; j < resultedPiece.comments[i].likedBy.length; j += 1) {
                                    if (resultedPiece.comments[i].likedBy[j] === username) {
                                        resultedPiece.comments[i].likedBy.splice(j, 1);
                                        break;
                                    }
                                }
                                break;
                            }
                        }

                        resultedPiece
                            .save()
                            .then(() => {
                                User.findOne({ "username": commentAuthor }, (error, resultUser) => {
                                    if (error) {
                                        return res.json(error);
                                    }

                                    resultUser.critiqueRating -= 1;
                                    if (resultUser.critiqueRating < 0) {
                                        resultUser.critiqueRating = 0;
                                    }

                                    resultUser.rank = evaluateRank(resultUser.critiqueRating);

                                    resultUser
                                        .save()
                                        .then(() => {
                                            return res.json({
                                                updatedComments: resultedPiece.comments,
                                                message: { type: "success", text: "Successfuly rated." }
                                            });
                                        });
                                });
                            });
                    }
                });
        }
    };
};
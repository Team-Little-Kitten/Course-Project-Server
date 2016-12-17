const literaryPiece = require("./../models/literary-piece");

module.exports = () => {
    return {
        getAllPieces(req, res) {
            literaryPiece.find({}, (err, pieces) => {
                if (err) {
                    return res.json(err);
                }

                return res.json(pieces);
            });
        },
        createPiece(req, res) {
            console.log(req.body);
            res.json({ message: "succefully sent" });
        }
    }
}
"user strict";

const Thread = require("./../models/thread");
const User = require("./../models/user");

function getCategoryRealName(categoryName) {
    if (categoryName === "userSuggestions") return "User Suggestions";
    if (categoryName === "commentAuthors") return "Comment Authors";
    if (categoryName === "lessons") return "Lessons";
    if (categoryName === "writeABookPreview") return "Write a Book Review";
    if (categoryName === "fun") return "Fun";
}

module.exports = () => {
    return {
        createThread(req, res) {
            let body = req.body;
            let thread = body.thread;
            let username = body.thread.author;


            User.findOne({ username }, (err, result) => {
                if (err) {
                    return res.json({ message: { type: "error", text: err.toString() } });
                }
                let author = {};
                author.username = result.username;
                author._id = result._id;

                return author;
            }).then((author) => {
                let newThread = new Thread({
                    title: thread.title,
                    content: thread.content,
                    author,
                    dateOfCreationg: Date.now(),
                    category: thread.category,
                    comments: []
                });

                newThread.save()
                    .then(createdThread => {
                        res.json({ message: { type: "success", text: createdThread } });
                    }, error => {
                        res.json({ message: { type: "error", text: error.toString() } });
                    });

            });

        },
        findThreadByTitle(req, res) {
            let body = req.body;
            let title = body.title;

            Thread.findOne({ title }, (err, thread) => {
                if (err) return res.json({ success: false, message: err.toString() });
                res.json({ success: true, thread });
            });
        },
        findByCategory(req, res) {
            let body = req.body;
            let categoryName = body.category.categoryName;
            let realCategoryName = getCategoryRealName(categoryName);

            Thread.find({ category: realCategoryName }, (err, threads) => {
                if (err) res.json({ success: false, message: err.toString() });
                return res.json({ success: true, result: threads });
            });
        },
        addComment(req, res) {
            let title = req.params.title;
            let comment = req.body;
            Thread.findOne({ title }, (err, thread) => {
                if (err) if (err) res.json({ success: false, message: error.toString() });
                
                thread.comments.push(comment);
                thread.save((error) => {
                    if (error) res.json({ success: false, message: error.toString() });
                    res.json({ success: true, thread });
                });
            })
        }
    };
};
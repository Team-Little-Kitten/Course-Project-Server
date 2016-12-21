"user strict";

const Thread = require("../models/thread");

module.exports = () => {
    return {
        createThread(req, res) {
            let body = req.body;
            let thread = body.thread;
            let newThread = {
                title: thread.title,
                content: thread.content,
                author: thread.author,
                dateOfCreationg: Date.now(),
                category: thread.category,
                comments: []
            };

            Thread.create(newThread)
                .then(createdThread => {
                    res.json({ success: true, thread: createdThread });
                }, error => {
                    res.json({ success: false, message: error.toString() });
                });
        },
        findThreadByTitle(req, res) {
            let body = req.body;
            let title = body.title;

            Thread.findOne({ title }, (err, thread) => {
                if (err) return res.json({ success: false, message: err.toString() });
                res.json({ success: true, thread });
            });
        }
    };
};
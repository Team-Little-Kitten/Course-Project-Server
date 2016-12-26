"use strict";

module.exports = ({ app, controllers }) => {
    app.post("/forum/threads/create", controllers.forum.createThread);
    app.post("/forum/threads/findByTitle", controllers.forum.findThreadByTitle);
    app.post("/forum/threads/findByCategory", controllers.forum.findByCategory);
    app.post("/forum/threads/:title/comments", controllers.forum.addComment);
};
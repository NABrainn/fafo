const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    text: { type: String, required: true },
    author_id: { type: Number, required: true, ref: "User" }, // Reference to User
    post_id: { type: Number, required: true, ref: "BlogPost" }, // Reference to BlogPost
    parent_post: { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" } // Back-populating to BlogPost
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;

const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    author_id: { type: Number, required: true, ref: "User" }, // Reference to User
    title: { type: String, required: true },
    subtitle: { type: String },
    date: { type: String, required: true },
    img_url: { type: String },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }] // Array of Comment references
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);
module.exports = BlogPost;

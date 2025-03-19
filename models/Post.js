const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required"], minlength: [5, "Title must be at least 5 characters"] },
  content: { type: String, required: [true, "Content is required"], minlength: [10, "Content must be at least 10 characters"] },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);

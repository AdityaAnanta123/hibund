const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  authorName: { type: String, required: true }, // Field baru untuk nama penulis
  createdAt: { type: Date, default: Date.now },
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;

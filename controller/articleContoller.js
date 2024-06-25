const Article = require('../models/article');

exports.createArticle = async (req, res) => {
  const { title, content, imageUrl, authorName } = req.body; // Ambil authorName dari body request

  try {
    // Buat artikel dengan nama penulis
    const newArticle = new Article({ title, content, imageUrl, authorName });
    await newArticle.save();
    res.status(201).json({ message: 'Article created successfully', article: newArticle });
  } catch (error) {
    console.error('Error creating article:', error.message);
    res.status(500).json({ error: 'Error creating article' });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error.message);
    res.status(500).json({ error: 'Error fetching articles' });
  }
};

exports.searchArticleByTitle = async (req, res) => {
  const { title } = req.query; // Ambil judul dari query parameter

  try {
    const articles = await Article.find({ title: { $regex: title, $options: 'i' } }); // Pencarian case-insensitive
    if (articles.length === 0) {
      return res.status(404).json({ message: 'No articles found with the given title' });
    }
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error searching articles:', error.message);
    res.status(500).json({ error: 'Error searching articles' });
  }
};
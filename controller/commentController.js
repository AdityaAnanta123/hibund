const Comment = require('../models/comment');
const User = require('../models/User');

exports.createComment = async (req, res) => {
  const { userId, content } = req.body; // Ambil userId dan content dari body request

  try {
    // Temukan pengguna berdasarkan userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Buat komentar dengan email pengguna
    const newComment = new Comment({ 
      user: userId, 
      email: user.email, 
      avatar: user.avatar,
      username: user.username,
      content 
    });
    await newComment.save();
    res.status(201).json({ message: 'Comment created successfully', comment: newComment });
  } catch (error) {
    console.error('Error creating comment:', error.message);
    res.status(500).json({ error: 'Error creating comment' });
  }
};

exports.updateComment = async (req, res) => {
  const commentId = req.params.id;
  const { userId, content } = req.body;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Verifikasi apakah komentar sesuai dengan pengguna yang sedang login
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized to update this comment' });
    }

    // Update komentar
    comment.content = content;
    await comment.save();

    res.status(200).json({ message: 'Comment updated successfully', updatedComment: comment });
  } catch (error) {
    console.error('Error updating comment:', error.message);
    res.status(500).json({ error: 'Error updating comment' });
  }
};

exports.deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const { userId } = req.body;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Verifikasi apakah komentar sesuai dengan pengguna yang sedang login
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this comment' });
    }

    // Hapus komentar
    await comment.remove();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error.message);
    res.status(500).json({ error: 'Error deleting comment' });
  }
};
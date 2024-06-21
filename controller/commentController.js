const Comment = require('../models/comment');
const User = require('../models/User'); // Import model User jika diperlukan

exports.createComment = async (req, res) => {
  const { userId, email, content } = req.body; // Ambil userId dan email dari data sesi atau di mana pun Anda menyimpannya

  try {
    // Temukan pengguna berdasarkan userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Buat komentar dengan email pengguna
    const newComment = new Comment({ user: userId, email, content });
    await newComment.save();
    res.status(201).json({ message: 'Comment created successfully', comment: newComment });
  } catch (error) {
    console.error('Error creating comment:', error.message);
    res.status(500).json({ error: 'Error creating comment' });
  }
};

exports.updateComment = async (req, res) => {
    const commentId = req.params.id;
    const { content } = req.body;
  
    try {
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $set: { content } },
        { new: true }
      );
  
      if (!updatedComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
  
      res.status(200).json({ message: 'Comment updated successfully', updatedComment });
    } catch (error) {
      console.error('Error updating comment:', error.message);
      res.status(500).json({ error: 'Error updating comment' });
    }
  };

exports.deleteComment = async (req, res) => {
  const commentId = req.params.id;

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment deleted successfully', deletedComment });
  } catch (error) {
    console.error('Error deleting comment:', error.message);
    res.status(500).json({ error: 'Error deleting comment' });
  }
};


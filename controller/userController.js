const User = require('../models/User'); // Import model User jika diperlukan
const bcrypt = require('bcryptjs');

exports.updateUser = async (req, res) => {
  const userId = req.params.id; // Ambil id pengguna dari params
  const { username, email, phone, password } = req.body; // Ambil data yang akan diperbarui dari body request

  try {
    // Temukan pengguna berdasarkan id
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Perbarui data pengguna
    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Jika ada file yang diunggah, perbarui avatar
    if (req.file) {
      user.avatar = req.file.path;
    }

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Error updating user' });
  }
};

exports.deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Error deleting user' });
  }
};
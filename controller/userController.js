const User = require('../models/User'); // Import model User jika diperlukan
const bcrypt = require('bcryptjs');

exports.updateUser = async (req, res) => {
  const userId = req.params.id; // Ambil id pengguna dari params
  const { username, email, phone, password } = req.body; // Ambil data yang akan diperbarui dari body request

  try {
    // Temukan pengguna berdasarkan id
    const user = await User.findByIdAndUpdate(userId, {
      username,
      email,
      phone,
      password: await bcrypt.hash(password, 10), // Hash password baru jika ada
    }, { new: true }); // Mengembalikan dokumen yang sudah diperbarui

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

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

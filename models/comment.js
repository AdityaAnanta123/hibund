const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Referensi ke model User
  username: { type: String, required: true }, // Field untuk menyimpan username
  email: { type: String }, // Field untuk menyimpan email pengguna
  avatar: { type: String }, // Field untuk menyimpan URL avatar
  content: { type: String, required: true },
  // Tambahan field lainnya yang diperlukan
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);

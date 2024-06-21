const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false },
  password: { type: String, required: false },
  authCode: { type: String },
  isVerified: { type: Boolean, default: false },
  resetCode: { type: String }, // Reset code for password reset
});
const User = mongoose.model("User", userSchema);
module.exports = User;
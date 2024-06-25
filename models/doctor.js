const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  name: { type: String, required: true },
  specialist: { type: String, required: true },
  location: { type: String, required: true },
  ratings: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  url: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);

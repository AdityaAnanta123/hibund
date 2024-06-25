const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Memastikan direktori uploads ada
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Mengatur penyimpanan untuk file yang diunggah
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Direktori penyimpanan file yang diunggah
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file yang unik
  }
});

// Mengatur multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Batas ukuran file (5MB)
  fileFilter: (req, file, cb) => {
    // Filter untuk menerima hanya gambar
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya gambar yang diperbolehkan'));
    }
  }
});

module.exports = upload;

const multer = require("multer");
const path = require("path");

// Use memory storage - images stored directly in database as BLOB, not on disk
// This ensures file.buffer is available in the controller for database storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed!"));
  }
};

module.exports = multer({ storage, fileFilter });

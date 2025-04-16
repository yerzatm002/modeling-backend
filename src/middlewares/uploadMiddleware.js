const multer = require("multer");
const path = require("path");

// Настройки хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Уникальное имя
  },
});

// Ограничения
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "model/stl", "model/obj"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Недопустимый формат файла"), false);
  }
};

// Middleware загрузки
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

module.exports = upload;

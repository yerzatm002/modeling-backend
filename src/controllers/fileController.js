const path = require("path");
const fs = require("fs-extra");

// ✅ Загрузка файла
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Файл обязателен" });
    }

    res.status(201).json({ message: "Файл загружен", filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки файла" });
  }
};

// ✅ Получение файла
const getFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../../uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Файл не найден" });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ error: "Ошибка получения файла" });
  }
};

// ✅ Удаление файла (только для админов)
const deleteFile = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const { filename } = req.params;
    const filePath = path.join(__dirname, "../../uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Файл не найден" });
    }

    await fs.unlink(filePath);
    res.json({ message: "Файл удален" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка удаления файла" });
  }
};

module.exports = { uploadFile, getFile, deleteFile };

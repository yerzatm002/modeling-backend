const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

router.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, "..", "uploads", filename);

  // Проверяем наличие файла
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: "Файл табылмады" });
  }

  res.download(filepath); // Или res.sendFile(filepath) если хочешь просто отобразить
});

module.exports = router;

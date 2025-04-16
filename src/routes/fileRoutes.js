const express = require("express");
const { uploadFile, getFile, deleteFile } = require("../controllers/fileController.js");
const upload = require("../middlewares/uploadMiddleware.js");
const { authenticate } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/upload", authenticate, upload.single("file"), uploadFile);
router.get("/uploads/:filename", getFile);
router.delete("/uploads/:filename", authenticate, deleteFile);

module.exports = router;

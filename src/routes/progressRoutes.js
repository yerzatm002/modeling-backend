const express = require("express");
const { getUserProgress, saveUserProgress } = require("../controllers/progressController.js");
const { authenticate } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/", authenticate, getUserProgress);
router.post("/", authenticate, saveUserProgress);

module.exports = router;

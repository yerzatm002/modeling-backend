const express = require("express");
const { getAllUsers, getSystemStats } = require("../controllers/adminController.js");
const { authenticate } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/users", authenticate, getAllUsers);
router.get("/dashboard", authenticate, getSystemStats);

module.exports = router;

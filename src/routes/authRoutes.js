const express = require("express");
const { register, login, getProfile, logout } = require("../controllers/authController.js");
const { authenticate } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getProfile);
router.post("/logout", logout);

module.exports = router; 

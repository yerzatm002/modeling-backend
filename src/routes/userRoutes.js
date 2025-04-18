const express = require("express");
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController.js");
const { authenticate } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/", authenticate, getAllUsers);
router.get("/:id", authenticate, getUserById);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, deleteUser);

module.exports = router;

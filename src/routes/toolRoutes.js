const express = require("express");
const {
  getAllTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
} = require("../controllers/toolController.js");
const { authenticate } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/", getAllTools);
router.get("/:id", getToolById);
router.post("/", authenticate, createTool);
router.put("/:id", authenticate, updateTool);
router.delete("/:id", authenticate, deleteTool);

module.exports = router;

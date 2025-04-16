const express = require("express");
const {
  getAllChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} = require("../controllers/challengeController.js");
const { authenticate } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/", getAllChallenges);
router.get("/:id", getChallengeById);
router.post("/", authenticate, createChallenge);
router.put("/:id", authenticate, updateChallenge);
router.delete("/:id", authenticate, deleteChallenge);

module.exports = router;

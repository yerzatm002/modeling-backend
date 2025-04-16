const express = require("express");
const {
    getQuizzesByLesson,
    submitQuizAnswer,
    getUserQuizProgress,
} = require("../controllers/quizController.js");
const { authenticate } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/lesson/:lessonId", getQuizzesByLesson);
router.post("/:quizId/answer", authenticate, submitQuizAnswer);
router.get("/user/:userId/progress", getUserQuizProgress);

module.exports = router;

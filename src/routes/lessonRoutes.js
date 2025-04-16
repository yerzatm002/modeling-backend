const express = require("express");
const {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  getAllLessons,
  updateLesson,
  deleteLesson,
  getCommentsByLesson, 
  createCommentForLesson 
} = require("../controllers/lessonController.js");
const { authenticate } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/courses/:id/lessons", getLessonsByCourse);
router.get("/lessons/:id", getLessonById);
router.post("/courses/:id/lessons", authenticate, createLesson);
router.put("/lessons/:id", authenticate, updateLesson);
router.delete("/lessons/:id", authenticate, deleteLesson);
router.get("/lessons", getAllLessons);
router.get("/lesson/comments/:lessonId", getCommentsByLesson);
router.post("/lesson/comments/:lessonId", authenticate, createCommentForLesson);

module.exports = router;

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");

const prisma = new PrismaClient(); // путь к Prisma клиенту
// Аутентификация
const { authenticate } = require("../middlewares/authMiddleware");

// Настройка Multer (локальное хранение)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

/* =============================
   ✅ 1. Получить задачи по уроку
============================= */
router.get("/lesson/:lessonId", async (req, res) => {
  const { lessonId } = req.params;
  try {
    const tasks = await prisma.Tasks.findMany({
      where: { lessonId },
      orderBy: { createdAt: "asc" },
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Тапсырмаларды жүктеу қатесі" });
  }
});

/* 1️⃣ GET /api/tasks — список всех практик */
router.get("/", async (req, res) => {
    try {
      const tasks = await prisma.practicalTask.findMany({
        orderBy: { createdAt: "asc" },
      });
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Тапсырмаларды жүктеу қатесі" });
    }
  });
  
  /* 2️⃣ GET /api/tasks/:id — одна задача */
  router.get("/:id", async (req, res) => {
    try {
      const task = await prisma.practicalTask.findUnique({
        where: { id: req.params.id },
      });
  
      if (!task) return res.status(404).json({ error: "Тапсырма табылған жоқ" });
  
      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Қате" });
    }
  });
  
  /* 3️⃣ POST /api/tasks/:taskId/submit — отправка файла */
  router.post("/:taskId/submit", authenticate, upload.single("file"), async (req, res) => {
    const { taskId } = req.params;
    const studentId = req.user.userId;
    const { comment } = req.body;
    const file = req.file;
  
    if (!file) return res.status(400).json({ error: "Файл жүктелмеген" });
  
    try {
      const submission = await prisma.taskSubmission.create({
        data: {
          taskId,
          studentId,
          comment,
          fileUrl: `/uploads/${file.filename}`,
        },
      });
  
      res.status(201).json({ message: "Сәтті тапсырылды", submission });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Сақтау қатесі" });
    }
  });
  
  /* 4️⃣ GET /api/tasks/my-submissions — свои сдачи */
  router.get("/user/submissions", authenticate, async (req, res) => {
    try {
        console.log(req.user.userId);
      const submissions = await prisma.taskSubmission.findMany({
        where: { studentId: req.user.userId },
        include: {
          task: { select: { id: true, title: true } },
        },
        orderBy: { submittedAt: "desc" },
      });
  
      res.json(submissions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Сабмиттерді жүктеу қатесі" });
    }
  });
  
  module.exports = router;
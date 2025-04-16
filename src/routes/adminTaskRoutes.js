const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { authenticate } = require("../middlewares/authMiddleware");

const prisma = new PrismaClient();

/* 5️⃣ GET /api/admin/submissions — все сабмиты (вся база) */
router.get("/submissions", authenticate, async (req, res) => {
  const { taskId } = req.query; // optional фильтр по taskId

  try {
    const submissions = await prisma.taskSubmission.findMany({
      where: taskId ? { taskId } : undefined,
      include: {
        task: { select: { id: true, title: true } },
        student: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Сабмиттерді жүктеу қатесі" });
  }
});

/* 6️⃣ GET /api/admin/submissions/:taskId — только по задаче */
router.get("/submissions/:taskId", authenticate, async (req, res) => {
  try {
    const submissions = await prisma.taskSubmission.findMany({
      where: { taskId: req.params.taskId },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Қате: жауаптар табылмады" });
  }
});

/* 7️⃣ PUT /api/submissions/:id/grade — оценка + отзыв */
router.put("/submissions/:id/grade", authenticate, async (req, res) => {
  const { grade, feedback } = req.body;

  if (grade == null || grade < 0 || grade > 100) {
    return res.status(400).json({ error: "Баға 0-100 арасында болуы керек" });
  }

  try {
    const updated = await prisma.taskSubmission.update({
      where: { id: req.params.id },
      data: {
        grade,
        feedback,
      },
    });

    res.json({ message: "Баға қойылды", updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Бағалау қатесі" });
  }
});

module.exports = router;

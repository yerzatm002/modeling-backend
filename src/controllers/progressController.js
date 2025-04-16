const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ✅ Получение прогресса пользователя
const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.userId; // Получаем ID авторизованного пользователя

    const progress = await prisma.progress.findMany({
      where: { userId },
      select: {
        id: true,
        lessonId: true,
        completed: true,
        updatedAt: true,
        lesson: {
          select: { title: true, courseId: true },
        },
      },
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Сохранение прогресса пользователя
const saveUserProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { lessonId, completed } = req.body;

    if (!lessonId) {
      return res.status(400).json({ error: "lessonId обязателен" });
    }

    const existingProgress = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    let progress;
    if (existingProgress) {
      progress = await prisma.progress.update({
        where: { userId_lessonId: { userId, lessonId } },
        data: { completed, updatedAt: new Date() },
      });
    } else {
      progress = await prisma.progress.create({
        data: { userId, lessonId, completed },
      });
    }

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

module.exports = {
  getUserProgress,
  saveUserProgress,
};

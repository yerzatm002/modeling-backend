const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ✅ Получение списка пользователей (Только для админов)
const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Получение статистики системы (Только для админов)
const getSystemStats = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const userCount = await prisma.user.count();
    const lessonCount = await prisma.lesson.count();
    const practicalTaskCount = await prisma.practicalTask.count();
    const taskSubmissionCount = await prisma.taskSubmission.count();

    const stats = {
      users: userCount,
      lessons: lessonCount,
      practicalTasks: practicalTaskCount,
      taskSubmissions: taskSubmissionCount,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

module.exports = { getAllUsers, getSystemStats };

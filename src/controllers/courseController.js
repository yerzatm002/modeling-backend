const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ✅ Получение списка курсов
const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      select: { id: true, title: true, description: true, imageUrl: true, createdAt: true },
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Получение информации о конкретном курсе
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      select: { id: true, title: true, description: true, imageUrl: true, createdAt: true },
    });

    if (!course) return res.status(404).json({ error: "Курс не найден" });

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Добавление нового курса (только для админов)
const createCourse = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const { title, description, imageUrl } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Название и описание обязательны" });
    }

    const newCourse = await prisma.course.create({
      data: { title, description, imageUrl },
    });

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Редактирование курса (только для админов)
const updateCourse = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const { id } = req.params;
    const { title, description, imageUrl } = req.body;

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: { title, description, imageUrl },
    });

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Удаление курса (только для админов)
const deleteCourse = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const { id } = req.params;

    await prisma.course.delete({ where: { id } });

    res.json({ message: "Курс удален" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};

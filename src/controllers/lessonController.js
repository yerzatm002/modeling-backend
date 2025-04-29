const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getAllLessons = async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        quizzes: {
          include: { options: true },
        },
        tasks: true,
        comments: {
          include: { user: { select: { id: true, firstName: true, lastName: true } } },
        },
      },
    });

    res.json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Серверлік қате" });
  }
};


const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        quizzes: {
          include: { options: true },
        },
        tasks: true,
        comments: {
          include: { user: { select: { id: true, firstName: true, lastName: true } } },
        },
      },
    });

    if (!lesson) return res.status(404).json({ error: "Сабақ табылған жоқ" });

    res.json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Серверлік қате" });
  }
};


// ✅ Получение списка уроков в курсе
const getLessonsByCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const lessons = await prisma.lesson.findMany({
      where: { courseId: id },
      select: { id: true, title: true, content: true, videoUrl: true, createdAt: true },
    });

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};


// ✅ Добавление урока в курс (только для админов)
const createLesson = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const { id } = req.params; // ID курса
    const { title, content, videoUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Название и контент обязательны" });
    }

    const newLesson = await prisma.lesson.create({
      data: { title, content, videoUrl, courseId: id },
    });

    res.status(201).json(newLesson);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Редактирование урока (только для админов)
const updateLesson = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const { id } = req.params;
    const { title, content, videoUrl } = req.body;

    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: { title, content, videoUrl },
    });

    res.json(updatedLesson);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Удаление урока (только для админов)
const deleteLesson = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const { id } = req.params;

    await prisma.lesson.delete({ where: { id } });

    res.json({ message: "Урок удален" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

const getCommentsByLesson = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { lessonId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Пікірлерді жүктеу қатесі" });
  }
};


const createCommentForLesson = async (req, res) => {
  const { lessonId } = req.params;
  const userId = req.user.id;
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Пікір бос болмауы керек" });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        text,
        lessonId,
        userId,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    res.status(201).json({ message: "Пікір сәтті қосылды", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Пікірді сақтау кезінде қате" });
  }
};


module.exports = {
  getLessonsByCourse,
  getAllLessons,
  getCommentsByLesson,
  createCommentForLesson,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};

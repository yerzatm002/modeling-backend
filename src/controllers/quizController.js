const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getQuizzesByLesson = async (req, res) => {
    const { lessonId } = req.params;
    try {
      const quizzes = await prisma.quiz.findMany({
        where: { lessonId },
        include: {
          options: true,
        },
      });
      res.json(quizzes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Қате: сұрақтарды жүктеу мүмкін болмады" });
    }
  };

  
  const submitQuizAnswer = async (req, res) => {
    const { quizId } = req.params;
    const userId = req.user.userId; 
    const { answer } = req.body;
    if (!userId) return res.status(401).json({ error: "Аутентификация талап етіледі" });

    try {
      const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
      if (!quiz) return res.status(404).json({ error: "Сұрақ табылған жоқ" });
        console.log(answer);
      const isCorrect = quiz.correct.trim().toLowerCase() === answer.trim().toLowerCase();
  
      const saved = await prisma.quizProgress.create({
        data: {
          userId,
          quizId,
          isCorrect,
        },
      });
  
      res.json({ result: isCorrect, saved });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Қате: жауапты сақтау мүмкін болмады" });
    }
  };

  
  const getUserQuizProgress = async (req, res) => {
    const { userId } = req.params;
    try {
      const progress = await prisma.quizProgress.findMany({
        where: { userId },
        include: {
          quiz: {
            include: {
              lesson: { select: { id: true, title: true } },
            },
          },
        },
      });
      res.json(progress);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Қате: прогрессті жүктеу мүмкін емес" });
    }
  };

  
  module.exports = {
    getQuizzesByLesson,
    submitQuizAnswer,
    getUserQuizProgress,
  };
  
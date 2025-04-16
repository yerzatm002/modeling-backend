const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ✅ Получение списка челленджей
const getAllChallenges = async (req, res) => {
  try {
    const challenges = await prisma.challenge.findMany({
      select: { id: true, title: true, description: true, createdAt: true },
    });

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Получение деталей челленджа
const getChallengeById = async (req, res) => {
  try {
    const { id } = req.params;

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      select: { id: true, title: true, description: true, createdAt: true },
    });

    if (!challenge) return res.status(404).json({ error: "Челлендж не найден" });

    res.json(challenge);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Добавление нового челленджа (только для админов)
const createChallenge = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Название и описание обязательны" });
    }

    const newChallenge = await prisma.challenge.create({
      data: { title, description },
    });

    res.status(201).json(newChallenge);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Редактирование челленджа (только для админов)
const updateChallenge = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const { id } = req.params;
    const { title, description } = req.body;

    const updatedChallenge = await prisma.challenge.update({
      where: { id },
      data: { title, description },
    });

    res.json(updatedChallenge);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Удаление челленджа (только для админов)
const deleteChallenge = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const { id } = req.params;

    await prisma.challenge.delete({ where: { id } });

    res.json({ message: "Челлендж удален" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

module.exports = {
  getAllChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
};

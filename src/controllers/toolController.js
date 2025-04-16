const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ✅ Получение списка инструментов
const getAllTools = async (req, res) => {
  try {
    const tools = await prisma.tool.findMany({
      select: { id: true, name: true, description: true, url: true, createdAt: true},
    });

    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Получение информации о конкретном инструменте
const getToolById = async (req, res) => {
  try {
    const { id } = req.params;

    const tool = await prisma.tool.findUnique({
      where: { id },
      select: { id: true, name: true, description: true, url: true, createdAt: true },
    });

    if (!tool) return res.status(404).json({ error: "Инструмент не найден" });

    res.json(tool);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Добавление нового инструмента (только для админов)
const createTool = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const { name, description, url } = req.body;

    if (!name || !description || !url) {
      return res.status(400).json({ error: "Название, описание и URL обязательны" });
    }

    const newTool = await prisma.tool.create({
      data: { name, description, url },
    });

    res.status(201).json(newTool);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Редактирование инструмента (только для админов)
const updateTool = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const { id } = req.params;
    const { name, description, url } = req.body;

    const updatedTool = await prisma.tool.update({
      where: { id },
      data: { name, description, url },
    });

    res.json(updatedTool);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Удаление инструмента (только для админов)
const deleteTool = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const { id } = req.params;

    await prisma.tool.delete({ where: { id } });

    res.json({ message: "Инструмент удален" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

module.exports = {
  getAllTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
};

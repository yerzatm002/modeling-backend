const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ✅ Получение списка пользователей (только для админов)
const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Получение информации о конкретном пользователе
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "ADMIN" && req.user.userId !== id) {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Обновление профиля пользователя
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, role } = req.body;

    if (req.user.userId !== id) {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { firstName, lastName, role: req.user.role === "ADMIN" ? role : undefined },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Удаление пользователя (только для админов)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    await prisma.user.delete({ where: { id } });

    res.json({ message: "Пользователь удален" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

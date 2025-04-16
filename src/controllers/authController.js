const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");

dotenv.config();
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "supersecret";

// Функция генерации JWT
const generateToken = (user) => {
  return jwt.sign({ userId: user.id, role: user.role }, SECRET, { expiresIn: "7d" });
};

// ✅ Регистрация пользователя
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email и пароль обязательны" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Пользователь уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName },
    });

    res.status(201).json({ message: "Регистрация успешна", user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Логин пользователя
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email и пароль обязательны" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Получение информации о пользователе
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, avatarUrl: true, firstName: true, lastName: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// ✅ Выход из системы (опционально)
const logout = async (req, res) => {
  res.json({ message: "Выход выполнен успешно" });
};

// ✅ Экспорт модулей CommonJS
module.exports = { register, login, getProfile, logout };

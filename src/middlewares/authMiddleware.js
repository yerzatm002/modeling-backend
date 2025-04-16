const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const SECRET = process.env.JWT_SECRET || "supersecret";

// Middleware для проверки авторизации
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Нет доступа. Токен отсутствует." });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("🔍 decoded user from token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Недействительный токен" });
  }
};

module.exports = { authenticate };
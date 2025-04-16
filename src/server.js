const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const courseRoutes = require("./routes/courseRoutes.js");
const lessonRoutes = require("./routes/lessonRoutes.js");
const progressRoutes = require("./routes/progressRoutes.js");
const toolRoutes = require("./routes/toolRoutes.js");
const challengeRoutes = require("./routes/challengeRoutes.js");
const fileRoutes = require("./routes/fileRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const taskRoutes = require("./routes/taskRoutes");
const quizRoutes = require("./routes/quizRoutes");
const adminTaskRoutes = require("./routes/adminTaskRoutes");
const uploadRoutes = require("./routes/uploadRoutes");


const { connectDB } = require("./config/db.js");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

connectDB();

// Маршруты
app.use("/api/uploads", uploadRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminTaskRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api", lessonRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api", fileRoutes);
app.use("/api/admin", adminRoutes);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});

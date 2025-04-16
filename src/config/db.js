const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL Database successfully!");
  } catch (error) {
    console.error("❌ Error connecting to the database:", error.message);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };

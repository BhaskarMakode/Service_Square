require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db");

const port = Number(process.env.PORT || 5000);

const startServer = async () => {
  await connectDB();

  const server = app.listen(port, () => {
    console.log(`LocalConnect API running on port ${port}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

startServer().catch((error) => {
  console.error("Failed to start LocalConnect API:", error);
  process.exit(1);
});

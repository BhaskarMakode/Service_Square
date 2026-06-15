const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is required. Add it to your environment variables.");
  }

  mongoose.set("strictQuery", true);

  const connection = await mongoose.connect(mongoUri);

  console.log(`MongoDB connected: ${connection.connection.host}`);
};

module.exports = connectDB;

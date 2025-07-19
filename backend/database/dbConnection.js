import mongoose from "mongoose";

export const connection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/ask_app");
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection error:", err);
    throw err;
  }
};

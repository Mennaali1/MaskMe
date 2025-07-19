import express from "express";
import { connection } from "./database/dbConnection.js";
import userRouter from "./src/modules/user/user.router.js";
import cors from "cors";
import messageRouter from "./src/modules/message/message.router.js";
import { appError } from "./src/utils/AppError.js";
import { globalErrHandlingMiddleware } from "./src/utils/globalErrHandlingMiddleware.js";

//handling any exception not related to express
process.on("uncaughtException", (err) => {
  console.log("uncaughtException", err);
});

const app = express();
const port = 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001", // ✅ your frontend port
    credentials: true, // ✅ only if you're sending cookies or auth headers
  })
);

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Test endpoint
app.get("/test", (req, res) => {
  res.json({
    message: "Backend is working!",
    timestamp: new Date().toISOString(),
  });
});

app.use("/user", userRouter);
app.use("/message", messageRouter);

// 404 handler
app.use((req, res, next) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  next(new appError("Invalid Url " + req.originalUrl));
});

app.use(globalErrHandlingMiddleware);

//handling any error not related to express
process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection", err);
});

// Start server first, then connect to database
app.listen(port, async () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - Health: http://localhost:${port}/health`);
  console.log(`   - Test: http://localhost:${port}/test`);
  console.log(`   - User: http://localhost:${port}/user`);
  console.log(`   - Message: http://localhost:${port}/message`);

  // Connect to database after server starts
  try {
    await connection();
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    console.log("⚠️  Server is running but database connection failed");
  }
});

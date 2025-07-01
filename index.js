import express from "express";
import { connection } from "./database/dbConnection.js";
import userRouter from "./src/modules/user/user.router.js";
import messageRouter from "./src/modules/message/message.router.js";
import { appError } from "./src/utils/AppError.js";
const app = express();
const port = 3000;
connection();
app.use(express.json());
app.use("/user", userRouter);
app.use("/message", messageRouter);
app.use((req, res, next) => {
  next(new appError("Invalid Url " + req.originalUrl));
});
app.use((err, req, res, next) => {
  let code = err.statusCode || 500;

  res.status(code).json({ err: err.message });
});
app.listen(port, () => console.log("app is runing"));

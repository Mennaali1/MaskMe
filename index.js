import express from "express";
import { connection } from "./database/dbConnection.js";
import userRouter from "./src/modules/user/user.router.js";
import messageRouter from "./src/modules/message/message.router.js";
import { appError } from "./src/utils/AppError.js";
import { globalErrHandlingMiddleware } from "./src/utils/globalErrHandlingMiddleware.js";
//handling any exception not related to express
process.on("uncaughtException", (err) => {
  console.log("uncaughtException", err);
});
const app = express();
const port = 3000;
connection();
app.use(express.json());
app.use("/user", userRouter);
app.use("/message", messageRouter);
app.use((req, res, next) => {
  next(new appError("Invalid Url " + req.originalUrl));
});
app.use(globalErrHandlingMiddleware);
//handling any error not related to express
process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection", err);
});

app.listen(port, () => console.log("app is runing"));

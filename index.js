import express from "express";
import { connection } from "./database/dbConnection.js";
import userRouter from "./src/modules/user/user.router.js";
import messageRouter from "./src/modules/message/message.router.js";
const app = express();
const port = 3000;
connection();
app.use(express.json());
app.use("/user", userRouter);
app.use("/message", messageRouter);
app.use((req, res) => {
  res.status(404).json({ message: "invalid URL " + req.originalUrl });
});
app.use((err, req, res, next) => {
  res.status(500).json({ message: "error", err });
});
app.listen(port, () => console.log("app is runing"));

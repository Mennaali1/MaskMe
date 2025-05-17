import express from "express";
import { addMessage, deleteMsg, getMessage } from "./message.controller.js";
import { auth } from "../../middleware/auth.js";
const messageRouter = express.Router();

messageRouter.post("/", addMessage);
messageRouter.get("/", auth, getMessage);
messageRouter.delete("/", auth, deleteMsg);

export default messageRouter;

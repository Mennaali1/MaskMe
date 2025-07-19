import express from "express";
import {
  addMessage,
  deleteMsg,
  getMessage,
  getAnsweredMessages,
  askQuestion,
  getUserQuestions,
  getQuestionsForUser,
  answerQuestion,
} from "./message.controller.js";
import { auth } from "../../middleware/auth.js";
const messageRouter = express.Router();

messageRouter.post("/", addMessage);
messageRouter.get("/", getMessage);
messageRouter.get("/answered", getAnsweredMessages);
messageRouter.post("/ask", auth, askQuestion); // Require auth for asking questions
messageRouter.get("/user-questions", auth, getUserQuestions); // Questions asked by user
messageRouter.get("/questions-for-me", auth, getQuestionsForUser); // Questions sent to user
messageRouter.post("/answer", auth, answerQuestion); // Answer a question
messageRouter.delete("/", auth, deleteMsg);

export default messageRouter;

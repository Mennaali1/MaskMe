import express from "express";
import {
  signin,
  signup,
  verify,
  getProfile,
  cleanupUnverifiedAccounts,
  resendVerification,
} from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
export const userRouter = express.Router();
userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/verify/:mailToken", verify);
userRouter.post("/resend-verification", resendVerification);
userRouter.get("/profile", auth, getProfile);
userRouter.post("/cleanup", cleanupUnverifiedAccounts); // Admin route for cleanup

export default userRouter;

import express from "express";
import { signin, signup, verify } from "./user.controller.js";
export const userRouter = express.Router();
userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/verify/:mailToken", verify);

export default userRouter;

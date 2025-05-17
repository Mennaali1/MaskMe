import mongoose from "mongoose";
import { userModel } from "./user.model.js";

const messageSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
    min: 2,
    max: 100,
  },
  sentToId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});
export const messageModel = mongoose.model("message", messageSchema);

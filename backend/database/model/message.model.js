import mongoose from "mongoose";
import { userModel } from "./user.model.js";

const messageSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: false,
      min: 2,
      max: 500,
    },
    answer: {
      type: String,
      required: false,
    },
    // Email of the person being asked (required for routing)
    targetEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: false,
      min: 2,
      max: 100,
    },
    // User ID of the person being asked
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    // User ID of the person asking (for tracking only, no email)
    askerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    // Status of the question
    status: {
      type: String,
      enum: ["pending", "answered", "rejected"],
      default: "pending",
    },
    // Legacy fields for backward compatibility
    sentToId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const messageModel = mongoose.model("message", messageSchema);

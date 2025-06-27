import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "too short"],
    maxLength: [25, "too long"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, min: 8, max: 25 },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  confirmEmail: {
    type: Boolean,
    default: false,
  },
});

export const userModel = mongoose.model("user", userSchema);

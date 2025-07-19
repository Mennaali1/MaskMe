import jwt from "jsonwebtoken";
import { appError } from "../utils/AppError.js";
import { userModel } from "../../database/model/user.model.js";
import { config } from "../../config.js";

export const auth = async (req, res, next) => {
  const token = req.headers["token"];

  console.log("Auth middleware - token present:", !!token);
  // Removed headers logging for security

  if (!token) {
    console.log("Auth middleware - No token provided");
    return res.status(401).json({
      message: "Token is required",
      error: "No token provided",
    });
  }

  jwt.verify(token, config.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log("Auth middleware - Token verification failed:", err.message);
      return res.status(401).json({
        message: "Invalid token",
        error: err.message,
      });
    }

    console.log("Auth middleware - Token decoded successfully");
    console.log("Auth middleware - User ID present:", !!decoded.user._id);

    // Additional security check: verify user still exists and is confirmed
    try {
      const user = await userModel.findById(decoded.user._id);
      if (!user) {
        console.log("Auth middleware - User not found in database");
        return res.status(401).json({
          message: "User not found",
          error: "User account does not exist",
        });
      }

      if (!user.confirmMail) {
        console.log("Auth middleware - User email not confirmed");
        return res.status(401).json({
          message: "Email not verified",
          error: "Please verify your email before accessing this feature",
        });
      }

      req.user = user;
      req.userId = { id: user._id }; // Set as object with id property
      next();
    } catch (error) {
      console.log("Auth middleware - Database error:", error.message);
      return res.status(500).json({
        message: "Authentication error",
        error: "Failed to verify user account",
      });
    }
  });
};

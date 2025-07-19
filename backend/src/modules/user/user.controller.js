import { userModel } from "../../../database/model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../mail/user.email.js";
import { errHandling } from "../../utils/errorHandling.js";
import { appError } from "../../utils/AppError.js";
import { auth } from "../../middleware/auth.js";
import { messageModel } from "../../../database/model/message.model.js";
import { config } from "../../../config.js";

export const signup = errHandling(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    // If user exists and is already verified, prevent re-registration
    if (existingUser.confirmMail) {
      return next(
        new appError(
          "This email is already registered and verified. Please try logging in instead.",
          400
        )
      );
    }

    // If user exists but is not verified, update their information and resend verification
    const hash = await bcrypt.hash(password, 8);
    await userModel.findOneAndUpdate(
      { email },
      {
        name,
        password: hash,
        confirmMail: false,
      },
      { new: true }
    );

    // Resend verification email
    sendEmail({ email });

    return res.json({
      message:
        "Account updated successfully. A new verification email has been sent. Please check your inbox to verify your account before logging in.",
    });
  }

  // If user doesn't exist, create new account
  const hash = await bcrypt.hash(password, 8);
  await userModel.insertMany({
    name,
    email,
    password: hash,
    confirmMail: false,
  });

  sendEmail({ email });
  res.json({
    message:
      "Account created successfully. Please check your email to verify your account before logging in.",
  });
});

export const verify = errHandling(async (req, res, next) => {
  const { mailToken } = req.params;
  jwt.verify(mailToken, config.JWT_SECRET, async (err, decoded) => {
    if (err) return next(new appError("invalid token", 402));
    await userModel.findOneAndUpdate(
      { email: decoded.email },
      { confirmMail: true },
      { new: true }
    );
    // Redirect to a universal success page (served by frontend)
    // Use the configured FRONTEND_URL so it works on any device
    return res.redirect(`${config.FRONTEND_URL}/verify-success.html`);
  });
});

//signin
export const signin = errHandling(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new appError("incorrect email or password", 401));
  }

  if (!user.confirmMail) {
    return next(
      new appError(
        "Please verify your email before logging in. Check your inbox for the verification link.",
        401
      )
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new appError("incorrect email or password", 401));
  }

  user.password = undefined;
  let token = jwt.sign({ user }, config.JWT_SECRET);
  return res.json({ message: "logged in successfully", token });
});

// Get profile messages
export const getProfile = errHandling(async (req, res, next) => {
  const userId = req.user._id;
  const messages = await messageModel.find({ user: userId });
  res.json({ messages });
});

// Get all answered questions
export const getAnsweredMessages = errHandling(async (req, res, next) => {
  const messages = await messageModel.find({
    answer: { $exists: true, $ne: "" },
  });
  res.json({ messages });
});

// Ask a question anonymously
export const askQuestion = errHandling(async (req, res, next) => {
  const { question, email } = req.body;
  await messageModel.create({ question, email });
  res.json({ message: "Question submitted" });
});

// Clean up old unverified accounts (can be called periodically)
export const cleanupUnverifiedAccounts = errHandling(async (req, res, next) => {
  // Remove accounts that are older than 24 hours and not verified
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const result = await userModel.deleteMany({
    confirmMail: false,
    createdAt: { $lt: twentyFourHoursAgo },
  });

  console.log(
    `Cleaned up ${result.deletedCount} unverified accounts older than 24 hours`
  );
  res.json({
    message: `Cleaned up ${result.deletedCount} unverified accounts`,
    deletedCount: result.deletedCount,
  });
});

// Resend verification email
export const resendVerification = errHandling(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new appError("Email is required", 400));
  }

  // Check if user exists
  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new appError("No account found with this email address", 404));
  }

  // Check if user is already verified
  if (user.confirmMail) {
    return next(
      new appError(
        "This account is already verified. Please try logging in instead.",
        400
      )
    );
  }

  // Resend verification email
  try {
    sendEmail({ email });
    res.json({
      message:
        "Verification email has been resent successfully. Please check your inbox and spam folder.",
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return next(
      new appError(
        "Failed to send verification email. Please try again later.",
        500
      )
    );
  }
});

import { messageModel } from "../../../database/model/message.model.js";
import { userModel } from "../../../database/model/user.model.js";
import { errHandling } from "../../utils/errorHandling.js";

export const addMessage = errHandling(async (req, res) => {
  const { message, sentToId } = req.body;
  await messageModel.insertMany({ message, sentToId });
  res.json({ message: "message sent successfully" });
});

export const getMessage = errHandling(async (req, res) => {
  const { id } = req.userId;
  const messages = await messageModel.find({ sentToId: id });
  res.json({ message: "messages:", messages });
});

export const deleteMsg = errHandling(async (req, res) => {
  const { id } = req.userId;
  const deletedMsg = await messageModel.findByIdAndDelete({ id });
  res.json({ message: "message deleted successfully" });
  if (!deletedMsg) return res.json({ message: "message not found" });
});

export const getAnsweredMessages = errHandling(async (req, res) => {
  // Get answered questions but exclude user information for anonymity
  const messages = await messageModel
    .find({
      answer: { $exists: true, $ne: "" },
    })
    .select("-askerUserId -targetUserId -askerEmail -targetEmail"); // Exclude user-related fields for anonymity

  res.json({ messages });
});

export const askQuestion = errHandling(async (req, res) => {
  const { question, targetEmail } = req.body;
  const userId = req.userId?.id; // Get user ID from auth middleware

  console.log("askQuestion - userId:", userId);
  console.log("askQuestion - question:", question);
  console.log("askQuestion - targetEmail:", targetEmail);

  // Validate required fields
  if (!question || !targetEmail) {
    return res.status(400).json({
      message: "Question and target email are required",
    });
  }

  // Check if target user exists
  const targetUser = await userModel.findOne({
    email: targetEmail.toLowerCase(),
  });
  if (!targetUser) {
    return res.status(404).json({
      message:
        "User with this email not found. Please check the email address.",
    });
  }

  // Create question with proper routing (completely anonymous)
  const questionData = {
    question,
    targetEmail: targetEmail.toLowerCase(),
    targetUserId: targetUser._id,
    status: "pending",
  };

  // Add asker user ID for tracking (but no email for anonymity)
  if (userId) {
    questionData.askerUserId = userId;
  }

  console.log("askQuestion - questionData:", questionData);

  const savedQuestion = await messageModel.create(questionData);
  console.log("askQuestion - saved question:", savedQuestion);

  res.json({
    message:
      "Question submitted successfully! It will be sent to the intended user.",
    targetUser: targetUser.name, // Return target user name for confirmation
  });
});

// New function to get user-specific questions
export const getUserQuestions = errHandling(async (req, res) => {
  const userId = req.userId?.id;

  console.log("getUserQuestions - userId:", userId);

  if (!userId) {
    console.log("getUserQuestions - No userId found");
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Get all questions asked by this user
  const userQuestions = await messageModel
    .find({
      askerUserId: userId,
      question: { $exists: true, $ne: "" },
    })
    .sort({ createdAt: -1 }); // Sort by newest first

  console.log("getUserQuestions - found questions:", userQuestions.length);
  console.log("getUserQuestions - questions:", userQuestions);

  res.json({ questions: userQuestions });
});

// New function to get questions sent to a user
export const getQuestionsForUser = errHandling(async (req, res) => {
  const userId = req.userId?.id;

  console.log("getQuestionsForUser - userId:", userId);

  if (!userId) {
    console.log("getQuestionsForUser - No userId found");
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Get all questions sent to this user
  const questionsForUser = await messageModel
    .find({
      targetUserId: userId,
      question: { $exists: true, $ne: "" },
    })
    .sort({ createdAt: -1 }); // Sort by newest first

  console.log(
    "getQuestionsForUser - found questions:",
    questionsForUser.length
  );

  res.json({ questions: questionsForUser });
});

// Function to answer a question
export const answerQuestion = errHandling(async (req, res) => {
  const { questionId, answer } = req.body;
  const userId = req.userId?.id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (!questionId || !answer) {
    return res
      .status(400)
      .json({ message: "Question ID and answer are required" });
  }

  // Find the question and verify it's for this user
  const question = await messageModel.findOne({
    _id: questionId,
    targetUserId: userId,
  });

  if (!question) {
    return res
      .status(404)
      .json({ message: "Question not found or not authorized to answer" });
  }

  // Update the question with the answer
  const updatedQuestion = await messageModel.findByIdAndUpdate(
    questionId,
    {
      answer,
      status: "answered",
      answeredAt: new Date(),
    },
    { new: true }
  );

  res.json({
    message: "Question answered successfully",
    question: updatedQuestion,
  });
});

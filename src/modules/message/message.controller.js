import { messageModel } from "../../../database/model/message.model.js";
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

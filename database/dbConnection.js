import mongoose from "mongoose";

export const connection = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/ask_app")
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log("error", err);
    });
};

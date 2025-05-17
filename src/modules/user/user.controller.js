//all users have signup and signin
//security hash password and token
import { userModel } from "../../../database/model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) return res.json({ message: "email already in use" });
  bcrypt.hash(password, 8, async function (err, hash) {
    await userModel.insertMany({ name, email, password: hash });
    res.json({ message: "user created" });
  });
};

//signin
export const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    user.password = undefined;
    let token = jwt.sign({ user }, "mennaalyfahmy");
    return res.json({ message: "logged in successfully", token });
  } else {
    res.json({ message: "incorrect username or password" });
  }
};

import { userModel } from "../../../database/model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../mail/user.email.js";
import { errHandling } from "../../utils/errorHandling.js";
import { appError } from "../../utils/AppError.js";

export const signup = errHandling(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) return next(new appError("email already in use", 400));
  const hash = await bcrypt.hash(password, 8);
  await userModel.insertMany({ name, email, password: hash });
  sendEmail({ email });
  res.json({ message: "user created" });
});

export const verify = errHandling(async (req, res, next) => {
  const { mailToken } = req.params;
  jwt.verify(mailToken, "mennaalyfahmy", async (err, decoded) => {
    if (err) return next(new appError("invalid token", 402));
    await userModel.findOneAndUpdate(
      { email: decoded.email },
      { confirmEmail: true },
      { new: true }
    );
    res.json({ message: "user verified successfully" });
  });
});

//signin
export const signin = errHandling(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    user.password = undefined;
    let token = jwt.sign({ user }, "mennaalyfahmy");
    return res.json({ message: "logged in successfully", token });
  } else {
    return next(new appError("incorrect username or password", 401));
  }
});

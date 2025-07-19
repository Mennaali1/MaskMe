import nodemailer from "nodemailer";
import { html } from "./user.mail.template.js";
import jwt from "jsonwebtoken";
import { config, getVerificationUrl } from "../../config.js";

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });
  let mailToken = jwt.sign({ email: options.email }, config.JWT_SECRET);

  const info = await transporter.sendMail({
    from: '"MaskMe" <menna3li01@gmail.com>',
    to: options.email,
    subject: "Verify Your Email - MaskMe",
    html: html(mailToken, config.FRONTEND_URL), // Pass the frontend URL
  });
};

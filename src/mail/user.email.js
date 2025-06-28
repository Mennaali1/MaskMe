import nodemailer from "nodemailer";
import { html } from "./user.mail.template.js";
import jwt from "jsonwebtoken";

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "menna3li01@gmail.com",
      pass: "faia urlv shsi eivo",
    },
  });
  let mailToken = jwt.sign({ email: options.email }, "mennaalyfahmy");

  const info = await transporter.sendMail({
    from: '"MaskMe" <menna3li01@gmail.com>',
    to: options.email,
    subject: "Hello ✔",
    html: html(mailToken), // HTML body
  });
};

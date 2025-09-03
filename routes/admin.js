// routes/admin.js
import express from "express";
import User from "../models/User.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Approve user
router.post("/approve/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    // Send approval email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "umerf3024@gmail.com", pass: "abta zxfn mshj fose" },
    });

    await transporter.sendMail(
      {
        from: "umerf3024@gmail.com",
        to: user.email,
        subject: "Registration Approved",
        text: "Your account has been approved. You can now log in with your PIN.",
      },
      (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      }
    );

    res.json({ message: "User approved and email sent", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

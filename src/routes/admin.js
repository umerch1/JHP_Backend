// routes/admin.js
import express from "express";
import User from "../models/User.js";
import nodemailer from "nodemailer";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin approval & management APIs
 */

/**
 * @swagger
 * /api/admin/approve/{id}:
 *   post:
 *     summary: Approve a user
 *     description: Approve a user account and send approval email to the user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to approve
 *         schema:
 *           type: string
 *           example: 64cfa1b5e8c9a123456789ab
 *     responses:
 *       200:
 *         description: User approved successfully and email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User approved and email sent
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64cfa1b5e8c9a123456789ab
 *                     email:
 *                       type: string
 *                       example: user@gmail.com
 *                     status:
 *                       type: string
 *                       example: approved
 *       400:
 *         description: Invalid user ID or server error
 */
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
      auth: {
        user: "umerf3024@gmail.com",
        pass: "abta zxfn mshj fose",
      },
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

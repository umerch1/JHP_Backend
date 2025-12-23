// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, mobile, email, pin, address, city, role } =
      req.body;

    // Hash PIN before saving
    const hashedPin = await bcrypt.hash(pin, 10);

    const user = new User({
      firstName,
      lastName,
      mobile,
      email,
      pin: hashedPin,
      address,
      city,
      role,
    });

    await user.save();
    res.json({
      message: "Registration submitted. Await admin approval.",
      user_id: user._id,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

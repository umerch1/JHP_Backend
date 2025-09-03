// routes/user.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// Get user status
router.get("/:id/status", async (req, res) => {
  const user = await User.findById(req.params.id).select("status");
  res.json({ status: user.status });
});
router.get("/pending", async (req, res) => {
  try {
    const users = await User.find({ status: "pending" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// PIN login
router.post("/login", async (req, res) => {
  const { email, pin } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ error: "User not found" });
  if (user.status !== "approved")
    return res.status(403).json({ error: "User not approved" });

  const isMatch = await bcrypt.compare(pin, user.pin);
  if (!isMatch)
    return res
      .status(400)
      .json({ error: "something went wrong. please try latter" });

  res.json({ message: "Login successful", user: user });
});

export default router;

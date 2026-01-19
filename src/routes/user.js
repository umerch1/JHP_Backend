// routes/user.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management & authentication APIs
 */

/**
 * @swagger
 * /api/user/{id}/status:
 *   get:
 *     summary: Get user approval status
 *     description: Get the approval status (pending / approved / rejected) of a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: 64cfa1b5e8c9a123456789ab
 *     responses:
 *       200:
 *         description: User status fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: approved
 *       404:
 *         description: User not found
 */
router.get("/:id/status", async (req, res) => {
  const user = await User.findById(req.params.id).select("status");
  res.json({ status: user.status });
});

/**
 * @swagger
 * /api/user/pending:
 *   get:
 *     summary: Get all pending users
 *     description: Fetch a list of all users whose status is pending (Admin use)
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Pending users list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 64cfa1b5e8c9a123456789ab
 *                   firstName:
 *                     type: string
 *                     example: Umer
 *                   lastName:
 *                     type: string
 *                     example: Farooq
 *                   email:
 *                     type: string
 *                     example: umer@gmail.com
 *                   status:
 *                     type: string
 *                     example: pending
 *       500:
 *         description: Server error
 */
router.get("/pending", async (req, res) => {
  try {
    const users = await User.find({ status: "pending" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login using PIN
 *     description: Login user using email and PIN. Only approved users can login.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - pin
 *             properties:
 *               email:
 *                 type: string
 *                 example: umer@gmail.com
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64cfa1b5e8c9a123456789ab
 *                     email:
 *                       type: string
 *                       example: umer@gmail.com
 *                     status:
 *                       type: string
 *                       example: approved
 *       400:
 *         description: User not found or invalid PIN
 *       403:
 *         description: User not approved
 */
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

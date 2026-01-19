// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & User Registration APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user. Account will be pending until admin approval.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - mobile
 *               - email
 *               - pin
 *               - address
 *               - city
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Umer
 *               lastName:
 *                 type: string
 *                 example: Farooq
 *               mobile:
 *                 type: string
 *                 example: "03001234567"
 *               email:
 *                 type: string
 *                 example: umer@gmail.com
 *               pin:
 *                 type: string
 *                 example: "1234"
 *               address:
 *                 type: string
 *                 example: Johar Town
 *               city:
 *                 type: string
 *                 example: Lahore
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registration submitted. Await admin approval.
 *                 user_id:
 *                   type: string
 *                   example: 64cfa1b5e8c9a123456789ab
 *       400:
 *         description: Bad request / Validation error
 */
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, mobile, email, pin, address, city, role, cv } =
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
      cv
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

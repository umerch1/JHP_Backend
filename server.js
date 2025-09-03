import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import uploadRoutes from "./routes/upload.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/upload", uploadRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/jobportal");

// Routes (we’ll add them below)
app.get("/", (req, res) => res.send("Job Portal API running"));

app.listen(5000, () => console.log("Server running on port 5000"));

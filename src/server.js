import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import uploadRoutes from "./routes/upload.js";
import jobsRoutes from "./routes/jobs.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swagger.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// Serve simple static client pages (e.g., post creation client)
app.use(express.static("public"));

app.use("/api/upload", uploadRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Connect to MongoDB
mongoose.connect("mongodb+srv://jhp-user:evz4mZbm8JwNUf6z@jhp.eqbqcrc.mongodb.net/?appName=jhp/jobportal");

// Routes (we’ll add them below)
app.get("/", (req, res) => res.send("Job Portal API running"));

app.listen(5000, () => console.log("Server running on port 5000"));

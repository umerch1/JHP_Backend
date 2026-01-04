import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a job (only employer role)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user; // set by authMiddleware
    if (!user || (user.role && user.role !== "employer")) {
      return res.status(403).json({ message: "Only employers can create jobs" });
    }

    const { title, company, location, salary, description, attachment } = req.body;

    const job = new Post({
      title,
      company,
      location,
      salary,
      description,
      attachment,
      createdBy: user.id || user._id,
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Post.find().sort({ createdAt: -1 }).populate("createdBy", "firstName lastName email");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single job
router.get("/:jobId", async (req, res) => {
  try {
    const job = await Post.findById(req.params.jobId).populate("createdBy", "firstName lastName email").populate("applicants", "firstName lastName email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Apply to a job providing userId in params (no authMiddleware)
router.post("/:jobId/apply/:userId", async (req, res) => {
  try {
    const { jobId, userId } = req.params;

    // Validate user exists and is a jobseeker
    const user = await User.findById(userId);
    if (!user || (user.role && user.role !== "jobseeker")) {
      return res.status(403).json({ message: "Only jobseekers can apply to jobs" });
    }

    const job = await Post.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const applicantId = user._id;
    const alreadyApplied = job.applicants && job.applicants.some(a => a.toString() === applicantId.toString());
    if (alreadyApplied) return res.status(400).json({ message: "Already applied" });

    job.applicants.push(applicantId);
    await job.save();

    res.json({ message: "Application submitted", jobId: job._id, applicant: applicantId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

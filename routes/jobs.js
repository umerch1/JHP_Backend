import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";

const router = express.Router();

// Create a job (only employer role) — employer id comes from params
router.post("/:employerId", async (req, res) => {
  try {
    const { employerId } = req.params;
    const { title, company, location, salary, description, attachment } = req.body;

    // Basic existence check for employer
    const employer = await User.findById(employerId);
    if (!employer) return res.status(404).json({ message: "Employer not found" });

    const job = new Post({
      title,
      company,
      location,
      salary,
      description,
      attachment,
      createdBy: employerId,
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

// Get jobs by employer id
router.get("/employer/:employerId", async (req, res) => {
  try {
    const { employerId } = req.params;
    const jobs = await Post.find({ createdBy: employerId }).sort({ createdAt: -1 }).populate("createdBy", "firstName lastName email");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all unique applicants across all jobs for an employer
router.get("/employer/:employerId/applicants", async (req, res) => {
  try {
    const { employerId } = req.params;

    // Verify employer exists and has employer role
    const employer = await User.findById(employerId);
    if (!employer || (employer.role && employer.role !== "employer")) {
      return res.status(403).json({ message: "Only employers can view applicants" });
    }

    const jobs = await Post.find({ createdBy: employerId }).select("applicants");

    // Collect unique applicant ids
    const ids = [];
    jobs.forEach(j => {
      if (Array.isArray(j.applicants)) {
        j.applicants.forEach(a => {
          if (a) ids.push(a.toString());
        });
      }
    });

    const uniqueIds = [...new Set(ids)];
    if (uniqueIds.length === 0) return res.json({ employerId, totalApplicants: 0, applicants: [] });

    const applicants = await User.find({ _id: { $in: uniqueIds } }).select("firstName lastName email role cv");

    res.json({ employerId, totalApplicants: applicants.length, applicants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get applicants for a specific job (employer only)
router.get("/employer/:employerId/job/:jobId/applicants", async (req, res) => {
  try {
    const { employerId, jobId } = req.params;

    // Verify employer exists and has employer role
    const employer = await User.findById(employerId);
    if (!employer || (employer.role && employer.role !== "employer")) {
      return res.status(403).json({ message: "Only employers can view applicants" });
    }

    const job = await Post.findById(jobId).populate("applicants", "firstName lastName email");
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Ensure the employer owns the job
    const jobOwnerId = job.createdBy && job.createdBy.toString ? job.createdBy.toString() : String(job.createdBy);
    if (jobOwnerId !== String(employerId)) {
      return res.status(403).json({ message: "Not authorized to view applicants for this job" });
    }

    res.json({ jobId: job._id, title: job.title, applicants: job.applicants || [] });
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

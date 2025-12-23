import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// ✅ Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder where files are saved
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// ✅ File filter (only CV formats)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
  }
};

// ✅ Multer config
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
});

// ✅ Upload route
router.post("/upload-cv", upload.single("cv"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(200).json({
    message: "CV uploaded successfully",
    file: {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      type: req.file.mimetype,
    },
  });
});

export default router;

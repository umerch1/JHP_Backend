import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload APIs
 */

// ✅ Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
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

/**
 * @swagger
 * /api/upload/upload-cv:
 *   post:
 *     summary: Upload user CV
 *     description: Upload CV file (PDF, DOC, DOCX). Max size 2MB.
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cv
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: CV uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: CV uploaded successfully
 *                 file:
 *                   type: object
 *                   properties:
 *                     originalName:
 *                       type: string
 *                       example: resume.pdf
 *                     fileName:
 *                       type: string
 *                       example: 1693123123-123456789.pdf
 *                     path:
 *                       type: string
 *                       example: uploads/1693123123-123456789.pdf
 *                     size:
 *                       type: number
 *                       example: 345678
 *                     type:
 *                       type: string
 *                       example: application/pdf
 *       400:
 *         description: No file uploaded or invalid file type
 */
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

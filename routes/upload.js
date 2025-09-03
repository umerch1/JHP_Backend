// backend/uploadRoutes.js
import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Saves to /uploads folder

router.post("/upload-cv", upload.single("cv"), (req, res) => {
  res.json({
    message: "CV uploaded successfully",
    file: req.file, // contains filename, path, etc.
  });
});

export default router;

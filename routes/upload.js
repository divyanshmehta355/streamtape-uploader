// routes/upload.js
import express from "express";
import multer from "multer";
import { uploadToStreamtape } from "../utils/uploadToStreamtape.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await uploadToStreamtape(
      req.file.buffer,
      req.file.originalname
    );
    res.status(200).json({ message: "File uploaded", ...result });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed: " + err.message });
  }
});

export default router;

import File from "../models/File.js";
import { uploadToStreamtape } from "../utils/streamtape.js";

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { buffer, originalname } = file;
    const { fileId, streamUrl, downloadUrl } = await uploadToStreamtape(
      buffer,
      originalname
    );

    const saved = await File.create({
      name: originalname,
      fileId,
      streamUrl,
      downloadUrl,
    });

    res.status(200).json(saved);
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Optional: list all files
uploadFile.listFiles = async (req, res) => {
  const files = await File.find().sort({ createdAt: -1 });
  res.json(files);
};

// Optional: get one file by ID
uploadFile.getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });
    res.json(file);
  } catch {
    res.status(400).json({ error: "Invalid ID" });
  }
};

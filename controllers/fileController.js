// controllers/fileController.js
import File from "../models/File.js";
import { uploadToStreamtape } from "../utils/uploadToStreamtape.js";

/**
 * @description Uploads a file, saves it to Streamtape, and records its metadata in the database.
 * @route POST /api/files/upload
 */
export const uploadFile = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file was uploaded." });
    }

    const { buffer, originalname } = file;

    // Upload the file to the external service
    const streamtapeData = await uploadToStreamtape(buffer, originalname);

    // Create a new file record in the database
    const savedFile = await File.create({
      name: originalname,
      fileId: streamtapeData.fileId,
      streamUrl: streamtapeData.streamUrl,
      downloadUrl: streamtapeData.downloadUrl,
    });

    // Respond with the data saved in YOUR database
    res.status(201).json(savedFile);
  } catch (error) {
    console.error("Upload Controller Error:", error.message);
    res
      .status(500)
      .json({ error: "An internal server error occurred during file upload." });
  }
};

/**
 * @description Retrieves a list of all file records from the database.
 * @route GET /api/files
 */
export const listFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.status(200).json(files);
  } catch (error) {
    console.error("List Files Error:", error.message);
    res.status(500).json({ error: "Failed to retrieve files." });
  }
};

/**
 * @description Gets a single file record by its database ID.
 * @route GET /api/files/:id
 */
export const getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: "File not found." });
    }

    res.status(200).json(file);
  } catch (error) {
    // This catches both server errors and invalid ID formats (cast errors)
    console.error("Get File Error:", error.message);
    res.status(400).json({ error: "Invalid file ID or server error." });
  }
};

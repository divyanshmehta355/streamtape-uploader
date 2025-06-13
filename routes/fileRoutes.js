// routes/fileRoutes.js
import express from "express";
import multer from "multer";
import {
  uploadFile,
  listFiles,
  getFile,
} from "../controllers/fileController.js";

const router = express.Router();

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle file upload. It uses the uploadFile controller.
// The endpoint is now `/api/files/upload` to be more descriptive.
router.post("/upload", upload.single("file"), uploadFile);

// Route to get all file records.
// Endpoint: GET /api/files
router.get("/", listFiles);

// Route to get a specific file by its MongoDB ID.
// Endpoint: GET /api/files/:id
router.get("/:id", getFile);

export default router;

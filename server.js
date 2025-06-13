// server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import fileRoutes from "./routes/fileRoutes.js"; // Renamed for clarity

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// Main route for file operations
app.use("/api/files", fileRoutes);

// Optional health check endpoint
app.get("/", (req, res) => res.send("API is working ✅"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

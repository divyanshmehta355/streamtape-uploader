// server.js
import express from "express";
import dotenv from "dotenv";
import uploadRoute from "./routes/upload.js";
import connectDB from "./utils/db.js";
import { cpus } from "os";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use("/api/upload", uploadRoute); // 👈 Mount the upload route

// Optional health check
app.get("/", (req, res) => res.send("API is working ✅"));

app.listen(PORT, () => {
  console.log(cpus().length);
  console.log(`Server running on port ${PORT}`);
});

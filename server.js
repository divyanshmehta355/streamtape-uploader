// server.js
import express from "express";
import dotenv from "dotenv";
import uploadRoute from "./routes/upload.js";

dotenv.config();

const app = express();

app.use("/api/upload", uploadRoute); // 👈 Mount the upload route

// Optional health check
app.get("/", (req, res) => res.send("API is working ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

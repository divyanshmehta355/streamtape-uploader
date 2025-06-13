// server.js (with Clustering)
import express from "express";
import dotenv from "dotenv";
import cluster from "cluster";
import { cpus } from "os";
import process from "process";
import connectDB from "./utils/db.js";
import fileRoutes from "./routes/fileRoutes.js";

// Determine the number of CPU cores available
const numCPUs = cpus().length;

// Load environment variables from .env file
dotenv.config();

// --- Cluster Implementation ---

// Check if the current process is the primary (master) process
if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);
  console.log(`Forking server for ${numCPUs} CPUs`);

  // Fork a worker process for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for when a worker process exits
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
    // You can optionally add more robust logic here, like delaying the fork
    cluster.fork();
  });
} else {
  // --- This code runs for each worker process ---

  const app = express();
  const PORT = process.env.PORT || 5000;

  // Each worker process connects to the database
  connectDB();

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Main route for file operations
  app.use("/api/files", fileRoutes);

  // Optional health check endpoint
  app.get("/", (req, res) =>
    res.send(`Worker ${process.pid} says API is working ✅`)
  );

  app.listen(PORT, () => {
    // Each worker will log this message
    console.log(
      `Worker ${process.pid} started and listening on http://localhost:${PORT}`
    );
  });
}

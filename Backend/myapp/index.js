import dotenv from "dotenv";

// MUST load environment variables BEFORE any other imports
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dns from "dns";

import noteRoutes from "./routes/note.route.js";
import authRoutes from "./routes/auth.route.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const port = process.env.PORT || 4002;

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://my-notes-gilt.vercel.app",
    ],
    credentials: true,
  })
);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/note", noteRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "My Notes API is running 🚀",
  });
});

// Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
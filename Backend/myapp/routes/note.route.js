import express from "express";

import {
  createNotes,
  getNotes,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected Routes
router.post("/create-note", authMiddleware, createNotes);

router.get("/get-notes", authMiddleware, getNotes);

router.put("/update-note/:id", authMiddleware, updateNote);

router.delete("/delete-note/:id", authMiddleware, deleteNote);

export default router;
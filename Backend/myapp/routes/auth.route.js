import express from "express";

import {
    registerUser,
    loginUser,
    getProfile,
    logoutUser
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Profile (Protected)
router.get("/profile", authMiddleware, getProfile);

// Logout
router.post("/logout", authMiddleware, logoutUser);

export default router;
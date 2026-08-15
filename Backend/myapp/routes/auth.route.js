import express from "express";

import {
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
    forgotPassword, 
    resetPassword,
    validateResetToken
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

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Validate Reset Token
router.get("/validate-reset-token", validateResetToken);

// Reset Password
router.post("/reset-password", resetPassword);

export default router;
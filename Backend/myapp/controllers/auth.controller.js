import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// Register User
export const registerUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // Validate password (8-10 chars, at least 1 upper, 1 lower, 1 number, 1 special, no spaces)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be 8-10 characters, include uppercase, lowercase, number, special character and no spaces"
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            fullname,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Account created successfully",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Oops! Something went wrong",
            error: error.message
        });
    }
};


// Login User
export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required"
            });
        }

        // Find User
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Oops! Something went wrong",
            error: error.message
        });

    }

};


// Get Logged-in User
export const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({
            message: "Oops! Something went wrong",
            error: error.message
        });

    }

};


// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        // Always respond with the same generic message to avoid enumeration
        const genericResponse = { message: "If an account exists for this email, a password reset link has been sent." };

        if (!user) {
            return res.status(200).json(genericResponse);
        }

        // Generate secure token
        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

        // 15 minutes expiry
        user.resetPasswordTokenHash = tokenHash;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        await user.save();

        // Build reset URL
        const resetUrl = `${process.env.FRONTEND_URL.replace(/\/$/, "")}/reset-password?token=${rawToken}`;

        const html = `
            <div style="font-family: sans-serif; line-height: 1.5; color: #111;">
              <h2>Password reset request</h2>
              <p>Hi ${user.fullname || "user"},</p>
              <p>We received a request to reset your password. Click the button below to set a new password. This link expires in 15 minutes.</p>
              <p><a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#1d3557;color:#fff;border-radius:6px;text-decoration:none;">Reset Password</a></p>
              <p>If you did not request a password reset, please ignore this email.</p>
              <hr />
              <p style="font-size:12px;color:#666">If the button doesn't work, copy and paste the following URL into your browser:</p>
              <p style="font-size:12px;color:#666">${resetUrl}</p>
            </div>
        `;

        try {
            await sendEmail({ to: user.email, subject: "Reset your My Notes password", html });
        } catch (err) {
            // Log safe server-side information only
            console.error("Failed to send reset email to:", user.email);
        }

        return res.status(200).json(genericResponse);

    } catch (error) {
        console.error("forgotPassword error:", error.message);
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};


// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        // Validate password against same policy used in registration
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be 8-10 characters, include uppercase, lowercase, number, special character and no spaces" });
        }

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({ resetPasswordTokenHash: tokenHash, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordTokenHash = null;
        user.resetPasswordExpires = null;

        await user.save();

        return res.status(200).json({ message: "Password has been reset successfully" });

    } catch (error) {
        console.error("resetPassword error:", error.message);
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};


// Validate Reset Token
export const validateResetToken = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({ 
            resetPasswordTokenHash: tokenHash, 
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        return res.status(200).json({ message: "Token is valid", isValid: true });

    } catch (error) {
        console.error("validateResetToken error:", error.message);
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};


// Logout
export const logoutUser = async (req, res) => {

    try {

        res.status(200).json({
            message: "Logged out successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Oops! Something went wrong",
            error: error.message
        });

    }

};
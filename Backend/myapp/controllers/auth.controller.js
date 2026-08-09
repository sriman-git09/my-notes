import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
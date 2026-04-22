import User from '../models/User.js';
import UserPreference from '../models/UserPreference.js';
import jwt from 'jsonwebtoken';

/*
-------------------------------------------------------
Generate JWT Token
This function creates a token after user login/register
-------------------------------------------------------
*/
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,        // user id stored in token payload
            email: user.email   // email stored in token payload
        },
        process.env.JWT_SECRET, // secret key from .env
        { expiresIn: '30d' }    // token expiry time
    );
};


/*
-------------------------------------------------------
Register New User
Creates a new account and default preferences
-------------------------------------------------------
*/
export const register = async (req, res, next) => {
    try {

        // 1️⃣ Extract user data from request body
        const { email, password, name } = req.body;

        // 2️⃣ Validate required fields
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "Please provide email, password and name"
            });
        }

        // 3️⃣ Check if user already exists
        const existingUser = await User.findByEmail(email);

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // 4️⃣ Create new user in database
        const user = await User.create({
            email,
            password,
            name
        });

        // 5️⃣ Create default user preferences
        await UserPreference.upsert(user.id, {
            dietary_restrictions: [],
            allergies: [],
            preferred_cuisines: [],
            default_servings: 4,
            measurement_unit: "metric"
        });

        // 6️⃣ Generate authentication token
        const token = generateToken(user);

        // 7️⃣ Send response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        });

    } catch (error) {
        next(error); // pass error to global error handler
    }
};



/*
-------------------------------------------------------
Login User
Verifies credentials and returns JWT token
-------------------------------------------------------
*/
export const login = async (req, res, next) => {
    try {

        // 1️⃣ Extract login credentials
        const { email, password } = req.body;

        // 2️⃣ Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        // 3️⃣ Find user by email
        const user = await User.findByEmail(email);

        // If user not found
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // 4️⃣ Verify password
        const isPasswordValid = await User.verifyPassword(
            password,
            user.password_hash
        );

        // If password incorrect
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // 5️⃣ Generate JWT token
        const token = generateToken(user);

        // 6️⃣ Send successful response
        res.json({
            success: true,
            message: "User logged in successfully",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            },
            token
        });

    } catch (error) {
        next(error);
    }
};



/*
-------------------------------------------------------
Get Current Logged In User
Uses data from JWT middleware (req.user)
-------------------------------------------------------
*/
export const getCurrentUser = async (req, res, next) => {
    try {

        // 1️⃣ Get user id from auth middleware
        const user = await User.findById(req.user.id);

        // 2️⃣ Check if user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 3️⃣ Send user data
        res.json({
            success: true,
            data: { user }
        });

    } catch (error) {
        next(error);
    }
};



/*
-------------------------------------------------------
Request Password Reset
Sends reset link to user email
(Currently only placeholder logic)
-------------------------------------------------------
*/
export const requestPasswordReset = async (req, res, next) => {
    try {

        // 1️⃣ Extract email from request
        const { email } = req.body;

        // 2️⃣ Validate email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide email"
            });
        }

        // 3️⃣ Check if user exists
        const user = await User.findByEmail(email);

        // 4️⃣ Do not reveal whether user exists (security best practice)
        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });

    } catch (error) {
        next(error);
    }
};
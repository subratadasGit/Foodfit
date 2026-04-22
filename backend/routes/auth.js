import express from "express";
const router = express.Router();

// Import authentication controller functions
import * as authController from "../controllers/authController.js";

// Import JWT authentication middleware
import authMiddleware from "../middleware/auth.js";


/*
-------------------------------------------------------
Public Routes (No authentication required)
-------------------------------------------------------
*/

// User login
router.post("/login", authController.login);

// User registration / signup
router.post("/signup", authController.register);

// Request password reset
router.post("/reset-password", authController.requestPasswordReset);



/*
-------------------------------------------------------
Protected Routes (Authentication required)
-------------------------------------------------------
*/

// Get currently logged-in user
// authMiddleware verifies JWT token before controller runs
router.get("/me", authMiddleware, authController.getCurrentUser);



/*
-------------------------------------------------------
Export Router
This router will be used in app.js or server.js
Example: app.use('/api/auth', router)
-------------------------------------------------------
*/
export default router;
import express from "express";
const router = express.Router();

// Import authentication controller functions
import * as userController from "../controllers/userController.js";

// Import JWT authentication middleware
import authMiddleware from "../middleware/auth.js";
router.use(authMiddleware);

// Get user profile
router.get("/profile", userController.getProfile);

// Update user profile
router.put("/profile", userController.updateProfile);

// Update user preferences
router.put("/preferences", userController.updateUserPreferences);

router.put("/change-password", userController.changePassword);

// Delete user account
router.delete("/account", userController.deleteAccount);

export default router;
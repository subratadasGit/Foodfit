import express from "express";
const router = express.Router();

import * as recipeController from "../controllers/recipeController.js";
import authMiddleware from "../middleware/auth.js";


/*
-------------------------------------------------------
All routes are protected
-------------------------------------------------------
*/
router.use(authMiddleware);


/*
-------------------------------------------------------
AI Routes
-------------------------------------------------------
*/

// Generate recipe using AI
router.post("/generate", recipeController.generateRecipe);

// Pantry-based suggestions
router.get("/suggestions", recipeController.getSmartPantrySuggestions);


/*
-------------------------------------------------------
Recipe CRUD Routes
-------------------------------------------------------
*/

// Get all recipes
router.get("/", recipeController.getRecipes);

// Get recent recipes
router.get("/recent", recipeController.getRecentRecipes);

// Get recipe stats
router.get("/stats", recipeController.getRecipeStats);

// Create recipe
router.post("/", recipeController.saveRecipe);

// Update recipe
router.put("/:id", recipeController.updateRecipe);

// Delete recipe
router.delete("/:id", recipeController.deleteRecipe);

// Get recipe by ID (keep LAST)
router.get("/:id", recipeController.getRecipeById);


export default router;
import express from "express";
const router = express.Router();

import * as mealplanController from "../controllers/mealPlanController.js";
import authMiddleware from "../middleware/auth.js";


/*
-------------------------------------------------------
All routes are protected
-------------------------------------------------------
*/
router.use(authMiddleware);


/*
-------------------------------------------------------
Meal Plan Routes
-------------------------------------------------------
*/

// Get weekly meal plan
router.get("/weekly", mealplanController.getWeeklyMealPlan);

// Get upcoming meals
router.get("/upcoming", mealplanController.getUpcomingMeals);

// Get meal plan stats
router.get("/stats", mealplanController.getMealPlanStats);

// Add recipe to meal plan
router.post("/", mealplanController.addRecipeToMeal);

// Delete meal plan entry
router.delete("/:id", mealplanController.deleteMealPlanEntry);


export default router;
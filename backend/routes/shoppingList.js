import express from "express";
const router = express.Router();
import * as shoppingListController from "../controllers/shoppingListController.js";
import authMiddleware from "../middleware/auth.js";


/*
-------------------------------------------------------
All routes are protected
-------------------------------------------------------
*/
router.use(authMiddleware);


/*
-------------------------------------------------------
Shopping List Routes
-------------------------------------------------------
*/

// Get all shopping list items
router.get("/", shoppingListController.getShoppingList);

// Generate shopping list from meal plan
router.post("/generate", shoppingListController.generateFromMealPlan);

router.post("/", shoppingListController.addItem);
router.put("/:id", shoppingListController.updateItem);
router.put("/:id/toggle", shoppingListController.toggleChecked);

router.delete("/:id", shoppingListController.deleteItem);
router.delete("/clear/checked", shoppingListController.clearChecked);
router.delete("/clear/all", shoppingListController.clearAll);

router.post("/add-to-pantry", shoppingListController.addCheckedToPantry);

export default router;
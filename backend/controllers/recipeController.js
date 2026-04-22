import Recipe from "../models/Recipe.js";
import PantryItem from "../models/PantryItem.js";
import {
  generateRecipe as generateRecipeAI,
  generatePantrySuggestions as generatePantrySuggestionsAI
} from "../utils/gemini.js";

const buildFallbackRecipe = ({
  ingredients = [],
  cuisineType = "Any",
  servings = 4,
  cookingTime = "medium"
}) => {
  const timeMap = { quick: 25, medium: 45, long: 75 };
  const totalTime = timeMap[cookingTime] || 45;
  const safeIngredients = ingredients.length ? ingredients : ["mixed vegetables", "salt", "oil"];

  return {
    name: `${cuisineType && cuisineType !== "any" ? cuisineType : "Home Style"} Pantry Bowl`,
    description: "A simple fallback recipe generated from your selected ingredients.",
    cuisine_type: cuisineType && cuisineType !== "any" ? cuisineType : "Fusion",
    difficulty: "easy",
    prep_time: Math.max(10, Math.floor(totalTime * 0.35)),
    cook_time: Math.max(15, Math.floor(totalTime * 0.65)),
    servings,
    ingredients: safeIngredients.map((name, index) => ({
      name,
      quantity: index === 0 ? 2 : 1,
      unit: index === 0 ? "cups" : "tbsp"
    })),
    instructions: [
      "Prepare and chop all ingredients into bite-sized pieces.",
      "Heat a pan with a little oil over medium heat.",
      "Add the ingredients in batches, starting with the ones that take longer to cook.",
      "Season with salt, pepper, and your preferred spices.",
      "Cook until tender, then serve warm."
    ],
    dietary_tags: [],
    nutrition: {
      calories: 380,
      protein: 12,
      carbs: 42,
      fats: 16,
      fiber: 8
    },
    cookingTips: [
      "Use high heat for quick sauteing and better texture.",
      "Add fresh herbs at the end for better flavor."
    ]
  };
};


/*
-------------------------------------------------------
Generate recipe using AI
-------------------------------------------------------
*/
export const generateRecipe = async (req, res, next) => {
  try {
    const {
      ingredients = [],
      usePantryIngredients = false,
      dietaryRestrictions = [],
      cuisineType = "any",
      servings = 4,
      cookingTime = "medium"
    } = req.body || {};

    // #region agent log
    globalThis.fetch?.('http://127.0.0.1:7429/ingest/860c1e93-04d7-494b-8f7c-ce92bf59e777',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4d38f5'},body:JSON.stringify({sessionId:'4d38f5',runId:'post-fix',hypothesisId:'H2',location:'backend/controllers/recipeController.js:generateRecipe',message:'generateRecipe request received',data:{userId:req.user?.id,ingredientsLen:Array.isArray(ingredients)?ingredients.length:null,usePantryIngredients,dietaryRestrictionsLen:Array.isArray(dietaryRestrictions)?dietaryRestrictions.length:null,cuisineType,servings,cookingTime},timestamp:Date.now()})})?.catch?.(()=>{});
    // #endregion

    let finalIngredients = Array.isArray(ingredients) ? [...ingredients] : [];

    if (usePantryIngredients) {
      const pantryItems = await PantryItem.findByUserId(req.user.id);
      const pantryNames = (pantryItems || []).map((item) => item.name).filter(Boolean);
      finalIngredients = [...new Set([...finalIngredients, ...pantryNames])];
    }

    if (!finalIngredients.length) {
      return res.status(400).json({
        success: false,
        message: "No ingredients provided to generate recipe"
      });
    }

    let recipe;
    let usedFallback = false;

    try {
      recipe = await generateRecipeAI({
        ingredients: finalIngredients,
        dietaryRestrictions,
        cuisineType,
        servings,
        cookingTime
      });
    } catch (error) {
      usedFallback = true;
      recipe = buildFallbackRecipe({
        ingredients: finalIngredients,
        cuisineType,
        servings,
        cookingTime
      });
    }

    res.json({
      success: true,
      message: usedFallback
        ? "Recipe generated using fallback mode (AI temporarily unavailable)"
        : "Recipe generated successfully",
      data: { recipe, usedFallback }
    });
  } catch (error) {
    next(error);
  }
};



/*
-------------------------------------------------------
Get smart pantry suggestions using AI
-------------------------------------------------------
*/
export const getSmartPantrySuggestions = async (req, res, next) => {
  try {

    const pantryItems = await PantryItem.findByUserId(req.user.id);

    const expiringItems = await PantryItem.getExpireSoon(req.user.id, 7);

    const suggestions = await generatePantrySuggestionsAI(
      pantryItems,
      expiringItems
    );

    res.json({
      success: true,
      message: "Pantry suggestions generated successfully",
      data: { suggestions }
    });

  } catch (error) {
    next(error);
  }
};



/*
-------------------------------------------------------
Save recipe
-------------------------------------------------------
*/
export const saveRecipe = async (req, res, next) => {
  try {

    const recipe = await Recipe.create(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: "Recipe saved successfully",
      data: { recipe }
    });

  } catch (error) {
    next(error);
  }
};



/*
-------------------------------------------------------
Get all recipes
-------------------------------------------------------
*/
export const getRecipes = async (req, res, next) => {
  try {

    const {
      search,
      cuisineType,
      difficulty,
      dietary_tag,
      max_cook_time,
      sort_by,
      sort_order,
      limit,
      offset
    } = req.query;

    const recipes = await Recipe.findUserId(req.user.id, {
      search,
      cuisine_type: cuisineType,
      difficulty,
      dietary_tags: dietary_tag,
      max_cook_time: max_cook_time ? parseInt(max_cook_time) : undefined,
      sortBy: sort_by,
      sortOrder: sort_order,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined
    });

    res.json({
      success: true,
      data: { recipes }
    });

  } catch (error) {
    next(error);
  }
};



/*
-------------------------------------------------------
Get recent recipes
-------------------------------------------------------
*/
export const getRecentRecipes = async (req, res, next) => {
  try {

    const limit = req.query.limit ? parseInt(req.query.limit) : 5;

    const recipes = await Recipe.getRecent(req.user.id, limit);

    res.json({
      success: true,
      data: { recipes }
    });

  } catch (error) {
    next(error);
  }
};



/*
-------------------------------------------------------
Get recipe by ID
-------------------------------------------------------
*/
export const getRecipeById = async (req, res, next) => {
  try {

    const { id } = req.params;

    const recipe = await Recipe.findById(id, req.user.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found"
      });
    }

    res.json({
      success: true,
      data: { recipe }
    });

  } catch (error) {
    next(error);
  }
};



/*
-------------------------------------------------------
Update recipe
-------------------------------------------------------
*/
export const updateRecipe = async (req, res, next) => {
  try {

    const { id } = req.params;

    const recipe = await Recipe.update(id, req.user.id, req.body);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found"
      });
    }

    res.json({
      success: true,
      message: "Recipe updated successfully",
      data: { recipe }
    });

  } catch (error) {
    next(error);
  }
};



/*
-------------------------------------------------------
Delete recipe
-------------------------------------------------------
*/
export const deleteRecipe = async (req, res, next) => {
  try {

    const { id } = req.params;

    const recipe = await Recipe.delete(id, req.user.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found"
      });
    }

    res.json({
      success: true,
      message: "Recipe deleted successfully",
      data: { recipe }
    });

  } catch (error) {
    next(error);
  }
};



/*
-------------------------------------------------------
Recipe statistics
-------------------------------------------------------
*/
export const getRecipeStats = async (req, res, next) => {
  try {

    const stats = await Recipe.getStats(req.user.id);

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    next(error);
  }
};
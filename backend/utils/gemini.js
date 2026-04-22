import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const RETRYABLE_STATUS_CODES = new Set([429, 500, 503]);
const RECIPE_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error) => {
  return RETRYABLE_STATUS_CODES.has(error?.status);
};

const generateWithRetryAndFallback = async (prompt, models) => {
  let lastError;

  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await ai.models.generateContent({
          model,
          contents: prompt
        });
      } catch (error) {
        lastError = error;
        if (!isRetryableError(error) || attempt === 2) {
          break;
        }
        await sleep(400 * (attempt + 1));
      }
    }
  }

  throw lastError;
};

const extractResponseText = (response) => {
  if (typeof response?.text === "string") {
    return response.text;
  }

  if (typeof response?.text === "function") {
    return response.text();
  }

  return response?.candidates?.[0]?.content?.parts
    ?.map((part) => part?.text || "")
    .join("") || "";
};

const parseJsonFromModelText = (rawText) => {
  const cleaned = String(rawText || "").replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start !== -1 && end !== -1 && end > start) {
    return JSON.parse(cleaned.slice(start, end + 1));
  }

  return JSON.parse(cleaned);
};

// Safety check
console.log("API KEY LOADED:", !!process.env.GEMINI_API_KEY);

/*
-------------------------------------------------------
Generate Recipe using AI
-------------------------------------------------------
*/
export const generateRecipe = async ({
  ingredients,
  dietaryRestrictions = [],
  cuisineType = "any",
  servings = 4,
  cookingTime = "medium"
}) => {

  const dietaryInfo =
    dietaryRestrictions.length > 0
      ? `dietary restrictions: ${dietaryRestrictions.join(", ")}`
      : "No dietary restrictions";

  const timeGuide = {
    quick: "under 30 minutes",
    medium: "30-60 minutes",
    long: "over 60 minutes"
  };

  const prompt = `Generate a detailed recipe.

Ingredients: ${ingredients.join(", ")}
${dietaryInfo}
Cuisine type: ${cuisineType}
Servings: ${servings}
Cooking time: ${timeGuide[cookingTime] || "any"}

Return ONLY valid JSON (no markdown):

{
  "name": "Recipe Name",
  "description": "Recipe Description",
  "cuisine_type": "${cuisineType}",
  "difficulty": "easy/medium/hard",
  "prep_time": number,
  "cook_time": number,
  "servings": ${servings},
  "ingredients": [
    {
      "name": "Ingredient Name",
      "quantity": number,
      "unit": "unit"
    }
  ],
  "instructions": [
    "Step 1",
    "Step 2"
  ],
  "dietary_tags": ["vegetarian"],
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fats": number,
    "fiber": number
  },
  "cookingTips": ["Tip 1", "Tip 2"]
}`;

  try {
    const response = await generateWithRetryAndFallback(prompt, RECIPE_MODELS);

    const text = extractResponseText(response);
    return parseJsonFromModelText(text);

  } catch (err) {
    const status = err?.status;
    console.error("Error generating recipe:", err);
    if (status === 503 || status === 429) {
      throw new Error("AI service is temporarily busy. Please try again in a few seconds.");
    }
    throw new Error("Failed to generate recipe");
  }
};



/*
-------------------------------------------------------
Generate Pantry Suggestions
-------------------------------------------------------
*/
export const generatePantrySuggestions = async (
  pantryItems,
  expiringItems = []
) => {

  const ingredients = pantryItems.map(item => item.name);

  const expiringText =
    expiringItems.length > 0
      ? `Priority ingredients: ${expiringItems.map(i => i.name).join(", ")}`
      : "";

  const prompt = `Available ingredients: ${ingredients.join(", ")}
${expiringText}

Suggest 3 recipe ideas.

Return ONLY JSON:
["Idea 1", "Idea 2", "Idea 3"]`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const text = extractResponseText(response);
    const cleaned = String(text || "").replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);

  } catch (err) {
    console.error("Error generating suggestions:", err);
    throw new Error("Failed to generate suggestions");
  }
};



/*
-------------------------------------------------------
Generate Cooking Tips
-------------------------------------------------------
*/
export const generateCookingTips = async (recipe) => {

  const prompt = `Recipe: ${recipe.name}
Ingredients: ${recipe.ingredients?.map(i => i.name).join(", ") || "N/A"}

Give 3-5 cooking tips.

Return ONLY JSON:
["Tip 1", "Tip 2"]`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const text = extractResponseText(response);
    const cleaned = String(text || "").replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);

  } catch (err) {
    console.error("Error generating tips:", err);
    return ["Cook with love and patience ❤️"];
  }
};


export default {
  generateRecipe,
  generatePantrySuggestions,
  generateCookingTips
};
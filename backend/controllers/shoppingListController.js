import ShoppingList from "../models/ShoppingList.js";


/*
-------------------------------------------------------
Generate shopping list from meal plan
-------------------------------------------------------
*/
export const generateFromMealPlan = async (req, res, next) => {
    try {

        const { startDate, endDate } = req.body;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required"
            });
        }

        const items = await ShoppingList.generateFromMealPlan(
            req.user.id,
            startDate,
            endDate
        );

        res.json({
            success: true,
            data: { items }
        });

    } catch (error) {
        next(error);
    }
};



/*
-------------------------------------------------------
Get shopping list
-------------------------------------------------------
*/
export const getShoppingList = async (req, res, next) => {
    try {

        const grouped = req.query.grouped === "true";

        const items = grouped
            ? await ShoppingList.getGroupByCategory(req.user.id)
            : await ShoppingList.findByUserId(req.user.id);

        res.json({
            success: true,
            data: { items }
        });

    } catch (error) {
        next(error);
    }
};



/*
-------------------------------------------------------
Add item
-------------------------------------------------------
*/
export const addItem = async (req, res, next) => {
    try {

        const item = await ShoppingList.create(req.user.id, req.body);

        res.status(201).json({
            success: true,
            data: { item }
        });

    } catch (error) {
        next(error);
    }
};



/*
-------------------------------------------------------
Update item
-------------------------------------------------------
*/
export const updateItem = async (req, res, next) => {
    try {

        const { id } = req.params;

        const item = await ShoppingList.update(
            id,
            req.user.id,
            req.body
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        res.json({
            success: true,
            message: "Item updated successfully",
            data: { item }
        });

    } catch (error) {
        next(error);
    }
};



/*
-------------------------------------------------------
Toggle checked status
-------------------------------------------------------
*/
export const toggleChecked = async (req, res, next) => {
    try {

        const { id } = req.params;

        const item = await ShoppingList.toggleChecked(
            id,
            req.user.id
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        res.json({
            success: true,
            message: "Item updated successfully",
            data: { item }
        });

    } catch (error) {
        next(error);
    }
};



/*
-------------------------------------------------------
Delete item
-------------------------------------------------------
*/
export const deleteItem = async (req, res, next) => {
    try {

        const { id } = req.params;

        const item = await ShoppingList.delete(
            id,
            req.user.id
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        res.json({
            success: true,
            message: "Item deleted successfully",
            data: { item }
        });

    } catch (error) {
        next(error);
    }
};



/*
-------------------------------------------------------
Clear checked items
-------------------------------------------------------
*/
export const clearChecked = async (req, res, next) => {
    try {

        const items = await ShoppingList.clearChecked(req.user.id);

        res.json({
            success: true,
            message: "Checked items cleared successfully",
            data: { items }
        });

    } catch (error) {
        next(error);
    }
};



/*
-------------------------------------------------------
Clear all items
-------------------------------------------------------
*/
export const clearAll = async (req, res, next) => {
    try {

        const items = await ShoppingList.clearAll(req.user.id);

        res.json({
            success: true,
            message: "All items cleared successfully",
            data: { items }
        });

    } catch (error) {
        next(error);
    }
};



/*
-------------------------------------------------------
Add checked items to pantry (TODO - requires model)
-------------------------------------------------------
*/
export const addCheckedToPantry = async (req, res, next) => {
    try {

        // ⚠️ Make sure this exists in your model
        const items = await ShoppingList.addCheckedToPantry(req.user.id);

        res.json({
            success: true,
            message: "Checked items added to pantry successfully",
            data: { items }
        });

    } catch (error) {
        next(error);
    }
};
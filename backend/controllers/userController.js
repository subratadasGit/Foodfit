import User from "../models/User.js";
import UserPreference from "../models/UserPreference.js";


/*
-------------------------------------------------------
Get User Profile
Returns user information along with preferences
-------------------------------------------------------
*/
export const getProfile = async (req, res, next) => {
    try {

        // 1️⃣ Get logged-in user ID from JWT middleware
        const userId = req.user.id;

        // 2️⃣ Fetch user details from database
        const user = await User.findById(userId);

        // 3️⃣ Fetch user preferences
        const preferences = await UserPreference.findById(userId);

        // 4️⃣ Send response
        res.json({
            success: true,
            data: {
                user,
                preferences
            }
        });

    } catch (error) {
        next(error);
    }
};



/*
-------------------------------------------------------
Update User Profile
Allows authenticated user to update their profile
-------------------------------------------------------
*/
export const updateProfile = async (req, res, next) => {
    try {

        // 1️⃣ Get user ID from authentication middleware
        const userId = req.user.id;

        // 2️⃣ Extract updated data from request body
        const updateData = req.body;

        // 3️⃣ Update user in database
        const user = await User.update(userId, updateData);

        // 4️⃣ Send updated user data
        res.json({
            success: true,
            data: {
                user
            }
        });

    } catch (error) {
        next(error);
    }
};



/*
-------------------------------------------------------
Update User Preferences
Creates or updates user preferences
-------------------------------------------------------
*/
export const updateUserPreferences = async (req, res, next) => {
    try {

        // 1️⃣ Upsert preferences (insert or update)
        const preferences = await UserPreference.upsert(
            req.user.id,
            req.body
        );

        // 2️⃣ Send response
        res.json({
            success: true,
            message: "User preferences updated successfully",
            data: {
                preferences
            }
        });

    } catch (error) {
        next(error);
    }
};



/*
-------------------------------------------------------
Change Password
Verifies current password before updating
-------------------------------------------------------
*/
export const changePassword = async (req, res, next) => {
    try {

        // 1️⃣ Extract passwords from request
        const { currentPassword, newPassword } = req.body;

        // 2️⃣ Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide current password and new password"
            });
        }

        // 3️⃣ Find current user
        const user = await User.findByEmail(req.user.email);

        // 4️⃣ Verify current password
        const isValid = await User.verifyPassword(
            currentPassword,
            user.password_hash
        );

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid current password"
            });
        }

        // 5️⃣ Update password
        await User.updatePassword(req.user.id, newPassword);

        // 6️⃣ Send success response
        res.json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        next(error);
    }
};



/*
-------------------------------------------------------
Delete Account
Removes user account from database
-------------------------------------------------------
*/
export const deleteAccount = async (req, res, next) => {
    try {

        // 1️⃣ Delete user from database
        await User.delete(req.user.id);

        // 2️⃣ Send confirmation response
        res.json({
            success: true,
            message: "Account deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};
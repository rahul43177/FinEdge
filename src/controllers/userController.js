const userService = require("../services/userService");
const responseUtils = require("../utils/responseUtils");
const logger = require("../middleware/logger");

async function createUser(req, res, next) {
    try {
        const userData = req.body;
        const user = await userService.createUser(userData);

        logger.info(`User created | userId=${user.id}`);

        responseUtils.successResponse(
            res,
            201,
            "User created successfully",
            user
        );
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const userData = req.body;

        const loginUser = await userService.loginUser(userData);

        logger.info(`User logged in | userId=${loginUser.userPayload.userId}`);

        responseUtils.successResponse(
            res,
            200,
            "Login successful",
            loginUser
        );
    } catch (error) {
        next(error);
    }
}

async function userProfile(req, res, next) {
    try {
        const userId = req.userData.userId;

        logger.info(`User profile requested | userId=${userId}`);

        const profile = await userService.getUserById(userId);

        responseUtils.successResponse(
            res,
            200,
            "User profile fetched successfully",
            profile
        );
    } catch (error) {
        next(error);
    }
}

const updateBudget = async (req, res, next) => {
    try {
        const userId = req.userData.userId;
        const budgetDetails = req.body;

        const updatedBudget =
            await userService.updateUserBudget(userId, budgetDetails);

        logger.info(`User budget updated | userId=${userId}`);

        responseUtils.successResponse(
            res,
            200,
            "Budget updated successfully",
            updatedBudget
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createUser,
    login,
    userProfile,
    updateBudget
};

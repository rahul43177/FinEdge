const User = require("../models/userModel"); 
const jwt = require("jsonwebtoken");
const error = require("../utils/errorUtils");
const logger = require("../middleware/logger");


async function createUser(userData) {
    const { name, email, password, monthlyBudget, savingTarget } = userData; 

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        logger.warn(`User registration attempt with existing email: ${email}`);
        error.throwError409("The user already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        monthlyBudget,
        savingTarget
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        monthlyBudget: user.monthlyBudget,
        savingTarget: user.savingTarget
    };
}


async function loginUser(userData) {
    const { email, password } = userData;

    const user = await User.findOne({ email });
    if (!user) {
        logger.warn(`Login failed | user not found | email=${email}`);
        error.throwError404("The User does not exist"); 
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        logger.warn(`Invalid login attempt | email=${email}`);
        error.throwError401("Invalid credentials");
    }

    const userPayload = {
        userId: user._id,
        name: user.name,
        email: user.email
    };

    const token = jwt.sign(userPayload, process.env.JWT_SECRET);


    return {
        userPayload,
        token
    };
}

async function getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
        error.throwError404("The User does not exist");
    }

    logger.info(`User profile fetched | userId=${userId}`);

    return {
        name: user.name,
        email: user.email,
        monthlyBudget: user.monthlyBudget,
        savingTarget: user.savingTarget
    };
}


async function updateUserBudget(userId, budgetDetails) {
    const { monthlyBudget, savingTarget } = budgetDetails;

    if (!monthlyBudget || !savingTarget) {
        error.throwError400("Please provide all the fields");
    }

    const updateUser = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                monthlyBudget,
                savingTarget
            }
        },
        { new: true }
    );

    if (!updateUser) {
        error.throwError404("The User does not exist");
    }

    return {
        userId: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        monthlyBudget: updateUser.monthlyBudget,
        savingTarget: updateUser.savingTarget
    };
}

module.exports = {
    createUser,
    loginUser,
    getUserById,
    updateUserBudget
};

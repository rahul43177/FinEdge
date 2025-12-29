const User = require("../models/userModel"); 
const jwt = require("jsonwebtoken");
async function createUser(userData) {
    const {name , email , password , monthlyBudget , savingTarget} = userData; 

    const existingUser = await User.findOne({email}); 
    if(existingUser) {
        const error = new Error("The user already exists"); 
        error.statusCode = 409; 
        throw error; 
    }

    const user = await User.create({
        name , 
        email , 
        password , 
        monthlyBudget , 
        savingTarget 
    })


    return {
        id : user._id , 
        name : user.name , 
        email : user.email , 
        monthlyBudget : user.monthlyBudget , 
        savingTarget : user.savingTarget 
    }
};

async function loginUser(userData) {
    const {email , password} = userData; 
    const user = await User.findOne({email}); 
    if(!user) {
        const error = new Error("The User does not exist"); 
        error.statusCode = 404; 
        throw error;
    }
    const userPayload = {
        userId : user._id , 
        name : user.name , 
        email : user.email ,
    }

    let isPasswordValid = await user.comparePassword(password); 

    if(!isPasswordValid) {
        const error = new Error("Invalid password")
        error.statusCode = 401; 
        throw error; 
    }

    const token= jwt.sign(userPayload , process.env.JWT_SECRET); 
    return {
        userPayload , 
        token 
    }
}

async function getUserById(userId) {
    const user = await User.findById(userId); 
    if(!user) {
        const error = new Error("User does not exists"); 
        error.statusCode = 404; 
        throw error; 
    }

    const userData = {
        name : user.name , 
        email : user.email , 
        monthlyBudget : user.monthlyBudget , 
        savingTarget : user.savingTarget 
    }

    return userData; 

}

async function updateUserBudget(userId, monthlyBudget, savingTarget) {
    const updateUser = await User.findByIdAndUpdate(
        userId , 
        {
            $set : {
                monthlyBudget : monthlyBudget , 
                savingTarget : savingTarget
            }
        } ,
        {
            new : true 
        }
    )

    if(!updateUser) {
        const error = new Error("The User does not exist"); 
        error.statusCode = 404;
        throw error; 
    }

    const userData = {
        userId : updateUser._id , 
        name : updateUser.name , 
        email : updateUser.email , 
        monthlyBudget : updateUser.monthlyBudget , 
        savingTarget : updateUser.savingTarget
    }

    return userData; 
}

module.exports = {
    createUser , 
    loginUser ,
    getUserById,
    updateUserBudget
}

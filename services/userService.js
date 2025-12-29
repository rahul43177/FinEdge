const User = require("../model/userModel")

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


module.exports = {
    createUser
}

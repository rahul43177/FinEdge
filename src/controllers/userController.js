const userService = require("../services/userService");

async function createUser(req , res , next) {
    try {
        const userData= req.body; 
        let user = await userService.createUser(userData); 
        res.status(201).json({
            status : true , 
            data : user , 
        })
    } catch(error) {
        next(error); 
    }
}

async function login(req,res,next) {
    try {   
        const userData = req.body;
        
        const loginUser = await userService.loginUser(userData); 
        res.status(200).json({
            status : true , 
            data : loginUser   
        })
    } catch(error) {
        next(error)
    }
}

async function userProfile(req,res,next) {
    try{
        const userId = req.userData.userId; 
        console.log("user entire data through token:" , req.userData); 
        const profile = await userService.getUserById(userId);
        
        res.status(200).json({
            status : true , 
            data : profile 
        })
    } catch(error) {
        next(error);
    }
}


const updateBudget = async (req,res,next) => {
    try {
        const userId = req.userData.userId; 
        const {monthlyBudget, savingTarget} = req.body; 

        const updatedBudget = await userService.updateUserBudget(userId , monthlyBudget , savingTarget);
        return res.status(201).json({
            status : true , 
            data : updatedBudget
        })

    } catch(error) {
        next(error); 
    }
}

module.exports = {
    createUser , 
    login, 
    userProfile , 
    updateBudget 
}


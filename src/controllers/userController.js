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

module.exports = {
    createUser , 
    login
}


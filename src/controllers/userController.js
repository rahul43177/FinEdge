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


module.exports = {
    createUser
}


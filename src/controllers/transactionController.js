const transactionService = require("../services/transactionService");

//createTransaction

async function createNewTransaction(req,res,next) {
    try {
        const userId = req.userData.userId; 
        const transactionData = req.body; 
        const newTransaction = await transactionService.createTransaction(userId , transactionData); 
        return res.status(201).json({
            status : true , 
            message : "Transaction added successfully" , 
            data : newTransaction 
        })
    } catch(error) {
        next(error);
    }
}


module.exports = {
    createNewTransaction
}
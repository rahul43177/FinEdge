const express = require("express");
const router = express.Router();
const { 
    createNewTransaction, 
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
  } = require("../controllers/transactionController");
const isValidToken = require("../middleware/authMiddleware");
const {validateCreateTransaction, validateUpdateTransaction} = require("../middleware/validator"); 

//1. Create new transaction API 
router.post("/" , isValidToken ,validateCreateTransaction, createNewTransaction); 

//2. Get all transactions API
router.get("/" , isValidToken , getAllTransactions);

//3. Get transaction by ID API
router.get("/:id" , isValidToken , getTransactionById);

//4. Update transaction API
router.patch("/:id" , isValidToken ,validateUpdateTransaction, updateTransaction);

//5. Delete transaction API
router.delete("/:id" , isValidToken , deleteTransaction);

module.exports = router; 




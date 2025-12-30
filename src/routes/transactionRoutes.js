const express = require("express");
const router = express.Router();
const { createNewTransaction } = require("../controllers/transactionController");
const isValidToken = require("../middleware/authMiddleware"); 

//1. Create new transaction API 
router.post("/" , isValidToken ,createNewTransaction); 

module.exports = router; 




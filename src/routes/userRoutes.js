const express = require("express");
const {createUser , login , userProfile, updateBudget} = require("../controllers/userController.js");
const isValidToken = require("../middleware/authMiddleware.js");


const router = express.Router(); 

//1. signUp Route
router.post("/" , createUser);

//2. Login route 
router.post("/login" , login);

//3. User profile 
router.get("/profile" , isValidToken , userProfile);

//4. Update budget 
router.patch("/budget" , isValidToken , updateBudget);

module.exports = router; 
const express = require("express");
const {createUser , login} = require("../controllers/userController.js")


const router = express.Router(); 

//1. signUp Route
router.post("/" , createUser);

//2. Login route 
router.post("/login" , login);
module.exports = router; 
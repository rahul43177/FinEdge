const express = require("express");
const router = express.Router();

const {
    getSummary
} = require("../controllers/summaryController");
const isValidToken = require("../middleware/authMiddleware");

//1. Get summary API
router.get("/" , isValidToken , getSummary);

module.exports = router;
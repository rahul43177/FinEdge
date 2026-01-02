const logger = require("../middleware/logger");
const error = require("../utils/errorUtils");
const mongoose = require("mongoose");
const cacheService = require("./cacheService");

async function getSummary(userId) {
    const cacheKey = `summary:${userId}`;
    const CACHE_TTL = 60 * 1000; // 60 seconds
    //Check cache first
    const cachedSummary = cacheService.get(cacheKey);
    if (cachedSummary) {
        return cachedSummary;
    }

    try {
        const Transaction = mongoose.model("Transaction");
        
        const incomeAgg = await Transaction.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(userId), type: "income" } },
            { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
        ]);

        const expenseAgg = await Transaction.aggregate([
            { $match: { userId: mongoose.Types.ObjectId(userId), type: "expense" } },
            { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
        ]);

        const totalIncome = incomeAgg[0] ? incomeAgg[0].totalIncome : 0;
        const totalExpense = expenseAgg[0] ? expenseAgg[0].totalExpense : 0;
        const netSavings = totalIncome - totalExpense;

        summary =  {
            totalIncome,
            totalExpense,
            netSavings};
        
        //Store in cache
        cacheService.set(cacheKey, summary, CACHE_TTL);

        return summary;
        
    } catch (err) {
        logger.error(`Error fetching summary for userId=${userId}: ${err.message}`);
        throw error.internalServerError("Failed to fetch summary");
    }
}

module.exports = {
    getSummary
};
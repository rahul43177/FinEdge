const responseUtils = require("../utils/responseUtils");
const logger = require("../middleware/logger");
const summaryService = require("../services/summaryService");

async function getSummary(req, res, next) {
    try {
        const userId = req.userData.userId;

        logger.info(`Fetch summary request | userId=${userId}`);

        const summary =
            await summaryService.getSummary(userId);

        responseUtils.successResponse(
            res,
            200,
            "Summary fetched successfully",
            summary
        );
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getSummary
};
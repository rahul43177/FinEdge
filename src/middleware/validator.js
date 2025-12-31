const error = require("../utils/errorUtils");
const dayjs = require("dayjs");
const logger = require("../middleware/logger");

function validateCreateTransaction(req, res, next) {
  logger.debug("validateCreateTransaction called");

  const { type, category, amount, date } = req.body;

  if (!type || !category || amount === undefined) {
    error.throwError400("Missing required fields");
  }

  if (!["income", "expense"].includes(type)) {
    error.throwError400("Invalid transaction type");
  }

  if (typeof amount !== "number" || amount < 0) {
    error.throwError400("Amount must be a non-negative number");
  }

  if (date) {
    const parsedDate = dayjs(date, "DD-MM-YYYY", true);
    if (!parsedDate.isValid()) {
      error.throwError400("Invalid date or format. Use DD-MM-YYYY");
    }
  }

  logger.debug("validateCreateTransaction passed");
  next();
}

function validateUpdateTransaction(req, res, next) {
  logger.debug("validateUpdateTransaction called");

  const updateData = req.body;
  if (!updateData || Object.keys(updateData).length === 0) {
    error.throwError400("No data provided for update");
  }

  const allowedUpdates = ['type', 'category', 'amount', 'description', 'date'];
  const safeUpdateData = Object.fromEntries(
    Object.entries(updateData).filter(([key]) =>
      allowedUpdates.includes(key)
    )
  );

  if (Object.keys(safeUpdateData).length === 0) {
    error.throwError400("No valid fields provided for update");
  }

  if (safeUpdateData.date) {
    const parsedDate = dayjs(safeUpdateData.date, "DD-MM-YYYY", true);
    if (!parsedDate.isValid()) {
      error.throwError400("Invalid date format. Use DD-MM-YYYY");
    }
  }

  logger.debug("validateUpdateTransaction passed");
  next();
}

module.exports = {
  validateCreateTransaction,
  validateUpdateTransaction,
};

const transactionService = require("../services/transactionService");
const responseUtils = require("../utils/responseUtils");
const logger = require("../middleware/logger");

async function createNewTransaction(req, res, next) {
  try {
    const userId = req.userData.userId;

    logger.info(`Create transaction request | userId=${userId}`);

    const newTransaction =
      await transactionService.createTransaction(userId, req.body);
    
    responseUtils.successResponse(
      res,
      201,
      "Transaction created successfully",
      newTransaction
    );
  } catch (error) {
    next(error);
  }
}

async function getAllTransactions(req, res, next) {
  try {
    const userId = req.userData.userId;

    logger.info(`Fetch transactions request | userId=${userId}`);

    const transactions =
      await transactionService.getAllTransactions(userId, req.query);

    responseUtils.successResponse(
      res,
      200,
      "Transactions fetched successfully",
      transactions
    );
  } catch (error) {
    next(error);
  }
}

async function getTransactionById(req, res, next) {
  try {
    const userId = req.userData.userId;
    const transactionId = req.params.id;

    logger.info(`Fetch transaction | transactionId=${transactionId} | userId=${userId}`);

    const transaction =
      await transactionService.getTransactionById(transactionId, userId);

    responseUtils.successResponse(
      res,
      200,
      "Transaction fetched successfully",
      transaction
    );
  } catch (error) {
    next(error);
  }
}

async function updateTransaction(req, res, next) {
  try {
    const userId = req.userData.userId;
    const transactionId = req.params.id;

    logger.info(`Update transaction | transactionId=${transactionId} | userId=${userId}`);

    const updatedTransaction =
      await transactionService.updateTransaction(
        transactionId,
        userId,
        req.body
      );

    responseUtils.successResponse(
      res,
      200,
      "Transaction updated successfully",
      updatedTransaction
    );
  } catch (error) {
    next(error);
  }
}

async function deleteTransaction(req, res, next) {
  try {
    const userId = req.userData.userId;
    const transactionId = req.params.id;

    const deleted =
      await transactionService.deleteTransaction(transactionId, userId);

    responseUtils.successResponse(
      res,
      200,
      "Transaction deleted successfully",
      deleted
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createNewTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};  
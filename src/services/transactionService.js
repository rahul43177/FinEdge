const dayjs = require("dayjs");
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const Transactions = require("../models/transactionModel");
const mongoose = require("mongoose");
const error = require("../utils/errorUtils");
const logger = require("../middleware/logger");

async function createTransaction(userId , transactionData) {
    const { type, category, amount, description } = transactionData;

    logger.info(`Creating transaction | userId=${userId}`);

    const newTransactionData = {
        userId,
        type,
        category,
        amount,
        description
    };

    let date = transactionData.date;
    if (date) {
        newTransactionData.date = dayjs(date, "DD-MM-YYYY", true).toDate();
    }

    const createNewTransaction = await Transactions.create(newTransactionData);

    logger.info(`Transaction created | transactionId=${createNewTransaction._id}`);

    const response = {
        ...createNewTransaction.toObject(),
        date: dayjs(createNewTransaction.date).format("DD-MM-YYYY")
    };

    return response;
}

async function getAllTransactions(userId, filters) {
    filters = filters || {};
    const filterQuery = { userId };

    logger.debug(`Fetching transactions | userId=${userId}`);

    if (filters.type) filterQuery.type = filters.type;
    if (filters.category) filterQuery.category = filters.category;

    if (filters.startDate || filters.endDate) {
        filterQuery.date = {};
        if (filters.startDate) {
            filterQuery.date.$gte = dayjs(filters.startDate, "DD-MM-YYYY").toDate();
        }
        if (filters.endDate) {
            filterQuery.date.$lte = dayjs(filters.endDate, "DD-MM-YYYY").toDate();
        }
    }

    const filteredTransaction = await Transactions.find(filterQuery);

    logger.info(`Transactions fetched | count=${filteredTransaction.length} | userId=${userId}`);

    return filteredTransaction.map(trans => ({
        ...trans.toObject(),
        date: dayjs(trans.date).format("DD-MM-YYYY")
    }));
}

async function getTransactionById(transactionId, userId) {
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        error.throwError400("Invalid transaction ID");
    }

    logger.debug(`Fetching transaction | transactionId=${transactionId} | userId=${userId}`);

    const transaction = await Transactions.findOne({ _id: transactionId, userId });

    if (!transaction) {
        error.throwError404("Transaction not found or not authorized");
    }

    logger.info(`Transaction fetched | transactionId=${transactionId}`);

    return transaction;
}

async function updateTransaction(transactionId, userId, updateData) {
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        error.throwError400("Invalid transaction ID");
    }

    logger.info(`Updating transaction | transactionId=${transactionId} | userId=${userId}`);

    const allowedUpdates = ['type', 'category', 'amount', 'description', 'date'];
    const safeUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([key]) =>
            allowedUpdates.includes(key)
        )
    );

    if (safeUpdateData.date) {
        safeUpdateData.date = dayjs(safeUpdateData.date, "DD-MM-YYYY", true).toDate();
    }

    const updatedTransaction = await Transactions.findOneAndUpdate(
        { _id: transactionId, userId },
        safeUpdateData,
        { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
        error.throwError404("Transaction not found or not authorized");
    }

    logger.info(`Transaction updated | transactionId=${transactionId}`);

    return updatedTransaction;
}

async function deleteTransaction(transactionId, userId) {
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        error.throwError400("Invalid transaction ID");
    }

    logger.info(`Deleting transaction | transactionId=${transactionId} | userId=${userId}`);

    const deleted = await Transactions.findOneAndDelete({
        _id: transactionId,
        userId
    });

    if (!deleted) {
        error.throwError404("Transaction not found or not authorized");
    }


    logger.info(`Transaction deleted | transactionId=${transactionId}`);

    return deleted;
}

module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};

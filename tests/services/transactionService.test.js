jest.mock("../../src/models/transactionModel");
jest.mock("../../src/services/cacheService", () => ({
  delete: jest.fn()
}));

const mongoose = require("mongoose");
const Transaction = require("../../src/models/transactionModel");
const cacheService = require("../../src/services/cacheService");
const transactionService = require("../../src/services/transactionService");
const error = require("../../src/utils/errorUtils");

describe("transactionService.createTransaction", () => {
  const userId = new mongoose.Types.ObjectId().toString();

  it("should create transaction and invalidate summary cache", async () => {
    const mockTxn = {
      _id: "txn123",
      userId,
      type: "expense",
      category: "food",
      amount: 200,
      date: new Date(),
      toObject: function () {
        return this;
      }
    };

    Transaction.create.mockResolvedValue(mockTxn);

    const result = await transactionService.createTransaction(userId, {
      type: "expense",
      category: "food",
      amount: 200
    });

    expect(Transaction.create).toHaveBeenCalled();
    expect(cacheService.delete).toHaveBeenCalledWith(`summary:${userId}`);
    expect(result).toHaveProperty("_id", "txn123");
  });
});

describe("transactionService.getTransactionById", () => {
  it("should throw error for invalid transaction ID", async () => {
    await expect(
      transactionService.getTransactionById("invalid-id", "user123")
    ).rejects.toThrow();
  });
});

describe("transactionService.updateTransaction", () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const txnId = new mongoose.Types.ObjectId().toString();

  it("should throw error if transaction not found", async () => {
    Transaction.findOneAndUpdate.mockResolvedValue(null);

    await expect(
      transactionService.updateTransaction(txnId, userId, { amount: 500 })
    ).rejects.toThrow();
  });
});

describe("transactionService.deleteTransaction", () => {
  const userId = new mongoose.Types.ObjectId().toString();
  const txnId = new mongoose.Types.ObjectId().toString();

  it("should delete transaction and invalidate cache", async () => {
    Transaction.findOneAndDelete.mockResolvedValue({ _id: txnId });

    const result = await transactionService.deleteTransaction(txnId, userId);

    expect(Transaction.findOneAndDelete).toHaveBeenCalled();
    expect(cacheService.delete).toHaveBeenCalledWith(`summary:${userId}`);
    expect(result).toHaveProperty("_id", txnId);
  });
});

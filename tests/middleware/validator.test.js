const {
  validateCreateTransaction,
  validateUpdateTransaction
} = require("../../src/middleware/validator");

describe("Transaction Validator Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    next = jest.fn();
  });

  describe("validateCreateTransaction", () => {
    it("should call next for valid payload", () => {
      req.body = {
        type: "expense",
        category: "food",
        amount: 200,
        date: "01-01-2026"
      };

      validateCreateTransaction(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it("should throw error if required fields are missing", () => {
      req.body = {
        type: "expense"
      };

      expect(() =>
        validateCreateTransaction(req, res, next)
      ).toThrow();
    });

    it("should throw error for invalid transaction type", () => {
      req.body = {
        type: "invalid",
        category: "food",
        amount: 100
      };

      expect(() =>
        validateCreateTransaction(req, res, next)
      ).toThrow();
    });
  });

  describe("validateUpdateTransaction", () => {
    it("should call next for valid update payload", () => {
      req.body = {
        amount: 500
      };

      validateUpdateTransaction(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it("should throw error if no update data is provided", () => {
      req.body = {};

      expect(() =>
        validateUpdateTransaction(req, res, next)
      ).toThrow();
    });
  });
});

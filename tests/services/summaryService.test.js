jest.mock("../../src/services/cacheService", () => ({
  get: jest.fn(),
  set: jest.fn()
}));

const mongoose = require("mongoose");
const cacheService = require("../../src/services/cacheService");
const summaryService = require("../../src/services/summaryService");

const mockAggregate = jest.fn();

mongoose.model = jest.fn(() => ({
  aggregate: mockAggregate
}));

describe("summaryService.getSummary - cache HIT", () => {
  it("should return cached summary if present", async () => {
    const userId = new mongoose.Types.ObjectId().toString();

    const cachedSummary = {
      totalIncome: 1000,
      totalExpense: 400,
      netSavings: 600
    };

    cacheService.get.mockReturnValue(cachedSummary);

    const result = await summaryService.getSummary(userId);

    expect(cacheService.get).toHaveBeenCalledWith(`summary:${userId}`);
    expect(result).toEqual(cachedSummary);
    expect(cacheService.set).not.toHaveBeenCalled();
  });
});

describe("summaryService.getSummary - cache MISS", () => {
  it("should compute summary and store in cache", async () => {
    const userId = new mongoose.Types.ObjectId().toString();

    cacheService.get.mockReturnValue(null);

    mockAggregate
      .mockResolvedValueOnce([{ totalIncome: 1500 }]) // income
      .mockResolvedValueOnce([{ totalExpense: 500 }]); // expense

    const result = await summaryService.getSummary(userId);

    expect(result).toEqual({
      totalIncome: 1500,
      totalExpense: 500,
      netSavings: 1000
    });

    expect(cacheService.set).toHaveBeenCalled();
  });
});

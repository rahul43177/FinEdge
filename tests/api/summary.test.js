const request = require("supertest");
const app = require("../../src/app");

let agent;
let token;

// 🔹 Mock models
jest.mock("../../src/models/userModel", () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

jest.mock("../../src/models/transactionModel", () => ({
  aggregate: jest.fn()
}));

const User = require("../../src/models/userModel");
const Transaction = require("../../src/models/transactionModel");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Summary API", () => {
  beforeAll(async () => {
    agent = request.agent(app);

    const user = {
      name: "Summary User",
      email: "summaryuser@example.com",
      password: "password123"
    };

    // ---- SIGNUP mocks ----
    User.findOne.mockResolvedValueOnce(null);
    User.create.mockResolvedValueOnce({
      _id: "user123",
      email: user.email
    });

    await agent.post("/users/signup").send(user);

    // ---- LOGIN mocks ----
    User.findOne.mockResolvedValueOnce({
      _id: "user123",
      email: user.email,
      comparePassword: jest.fn().mockResolvedValue(true)
    });

    const loginRes = await agent.post("/users/login").send({
      email: user.email,
      password: user.password
    });

    token = loginRes.body.data.token;
  });

  it("GET /summary should return income, expense, and netSavings", async () => {
    // ---- SUMMARY mocks ----
    Transaction.aggregate
      .mockResolvedValueOnce([{ totalIncome: 1000 }])
      .mockResolvedValueOnce([{ totalExpense: 400 }]);

    const res = await agent
      .get("/summary")
      .set("Authorization", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual({
      totalIncome: 1000,
      totalExpense: 400,
      netSavings: 600
    });
  });

  it("GET /summary without token should return 401", async () => {
    const res = await agent.get("/summary");
    expect(res.statusCode).toBe(401);
  });
});

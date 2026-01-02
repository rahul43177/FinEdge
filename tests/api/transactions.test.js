const request = require("supertest");
const app = require("../../src/app");

let token;

describe("Transactions API", () => {
  beforeAll(async () => {
    agent = request.agent(app);

    const user = {
      name: "Txn User",
      email: "txnuser@example.com",
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

  describe("POST /transactions", () => {
    it("should create a transaction", async () => {
      const res = await request(app)
        .post("/transactions")
        .set("Authorization", token)
        .send({
          type: "expense",
          category: "food",
          amount: 300,
          description: "Lunch"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty("_id");
      expect(res.body.data.amount).toBe(300);
    });

    it("should fail without token", async () => {
      const res = await request(app)
        .post("/transactions")
        .send({
          type: "expense",
          category: "food",
          amount: 100
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /transactions", () => {
    it("should return all transactions for user", async () => {
      const res = await request(app)
        .get("/transactions")
        .set("Authorization", token);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});

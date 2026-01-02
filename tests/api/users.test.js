const request = require("supertest");
jest.mock("../../src/models/userModel", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn()
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked-jwt-token")
}));

const app = require("../../src/app");
const User = require("../../src/models/userModel");

describe("Users API", () => {
  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "password123"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /users/signup", () => {
    it("should create a new user", async () => {
      // no existing user
      User.findOne.mockResolvedValueOnce(null);

      // mock created user
      User.create.mockResolvedValueOnce({
        _id: "user123",
        name: testUser.name,
        email: testUser.email,
        monthlyBudget: 0,
        savingTarget: 0
      });

      const res = await request(app)
        .post("/users/signup")
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
    });

    it("should not allow duplicate email signup", async () => {
      User.findOne.mockResolvedValueOnce({
        email: testUser.email
      });

      const res = await request(app)
        .post("/users/signup")
        .send(testUser);

      expect(res.statusCode).toBe(409);
    });
  });

  describe("POST /users/login", () => {
    it("should login user and return token", async () => {
      User.findOne.mockResolvedValueOnce({
        _id: "user123",
        name: testUser.name,
        email: testUser.email,
        comparePassword: jest.fn().mockResolvedValue(true)
      });

      const res = await request(app)
        .post("/users/login")
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.token).toBe("mocked-jwt-token");
    });

    it("should fail login with wrong password", async () => {
      User.findOne.mockResolvedValueOnce({
        comparePassword: jest.fn().mockResolvedValue(false)
      });

      const res = await request(app)
        .post("/users/login")
        .send({
          email: testUser.email,
          password: "wrongpassword"
        });

      expect(res.statusCode).toBe(401);
    });
    it("should handle unexpected errors via global error handler", async () => {
  // Force User.findOne to throw an unexpected error
  User.findOne.mockImplementationOnce(() => {
    throw new Error("DB crashed");
  });

  const res = await request(app)
    .post("/users/signup")
    .send({
      name: "Error User",
      email: "error@example.com",
      password: "password123"
    });

  expect(res.statusCode).toBe(500);
  expect(res.body).toHaveProperty("status", false);
  expect(res.body).toHaveProperty("message");
});
  });
});

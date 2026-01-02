jest.mock("../../src/models/userModel");
jest.mock("jsonwebtoken");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/userModel");
const userService = require("../../src/services/userService");
const errorUtils = require("../../src/utils/errorUtils");

describe("userService", () => {
  const userId = new mongoose.Types.ObjectId().toString();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a new user when email does not exist", async () => {
      User.findOne.mockResolvedValue(null);

      User.create.mockResolvedValue({
        _id: userId,
        name: "Test User",
        email: "test@example.com",
        monthlyBudget: 1000,
        savingTarget: 200
      });

      const result = await userService.createUser({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        monthlyBudget: 1000,
        savingTarget: 200
      });

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(User.create).toHaveBeenCalled();
      expect(result).toEqual({
        id: userId,
        name: "Test User",
        email: "test@example.com",
        monthlyBudget: 1000,
        savingTarget: 200
      });
    });

    it("should throw 409 error if user already exists", async () => {
      User.findOne.mockResolvedValue({ email: "test@example.com" });

      await expect(
        userService.createUser({
          name: "Test User",
          email: "test@example.com",
          password: "password123"
        })
      ).rejects.toThrow();
    });
  });

  describe("loginUser", () => {
    it("should return token and payload for valid credentials", async () => {
      const mockUser = {
        _id: userId,
        name: "Test User",
        email: "test@example.com",
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("mocked-jwt-token");

      const result = await userService.loginUser({
        email: "test@example.com",
        password: "password123"
      });

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(mockUser.comparePassword).toHaveBeenCalledWith("password123");
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toHaveProperty("token", "mocked-jwt-token");
      expect(result.userPayload).toEqual({
        userId,
        name: "Test User",
        email: "test@example.com"
      });
    });

    it("should throw 404 if user not found", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(
        userService.loginUser({
          email: "notfound@example.com",
          password: "password123"
        })
      ).rejects.toThrow();
    });

    it("should throw 401 if password is invalid", async () => {
      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      User.findOne.mockResolvedValue(mockUser);

      await expect(
        userService.loginUser({
          email: "test@example.com",
          password: "wrongpassword"
        })
      ).rejects.toThrow();
    });
  });

  describe("getUserById", () => {
    it("should return user profile if user exists", async () => {
      User.findById.mockResolvedValue({
        name: "Test User",
        email: "test@example.com",
        monthlyBudget: 1000,
        savingTarget: 200
      });

      const result = await userService.getUserById(userId);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        name: "Test User",
        email: "test@example.com",
        monthlyBudget: 1000,
        savingTarget: 200
      });
    });

    it("should throw 404 if user does not exist", async () => {
      User.findById.mockResolvedValue(null);

      await expect(
        userService.getUserById(userId)
      ).rejects.toThrow();
    });
  });

  describe("updateUserBudget", () => {
    it("should update monthlyBudget and savingTarget", async () => {
      User.findByIdAndUpdate.mockResolvedValue({
        _id: userId,
        name: "Test User",
        email: "test@example.com",
        monthlyBudget: 2000,
        savingTarget: 500
      });

      const result = await userService.updateUserBudget(userId, {
        monthlyBudget: 2000,
        savingTarget: 500
      });

      expect(User.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({
        userId,
        name: "Test User",
        email: "test@example.com",
        monthlyBudget: 2000,
        savingTarget: 500
      });
    });

    it("should throw 400 if budget fields are missing", async () => {
      await expect(
        userService.updateUserBudget(userId, {})
      ).rejects.toThrow();
    });

    it("should throw 404 if user does not exist", async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        userService.updateUserBudget(userId, {
          monthlyBudget: 1000,
          savingTarget: 200
        })
      ).rejects.toThrow();
    });
  });
});

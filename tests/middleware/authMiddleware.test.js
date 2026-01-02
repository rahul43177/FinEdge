jest.mock("jsonwebtoken");

const jwt = require("jsonwebtoken");
const authMiddleware = require("../../src/middleware/authMiddleware");

describe("authMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {};
    next = jest.fn();
  });

  it("should return 401 if token is missing", async () => {
    await authMiddleware(req, res, next);

    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(401);
  });

  it("should return 401 for invalid token", async () => {
    req.headers.authorization = "invalid-token";
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await authMiddleware(req, res, next);

    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
  });

  it("should attach userData and call next for valid token", async () => {
    req.headers.authorization = "valid-token";
    jwt.verify.mockReturnValue({ userId: "123", email: "test@example.com" });

    await authMiddleware(req, res, next);

    expect(req.userData).toEqual({
      userId: "123",
      email: "test@example.com"
    });
    expect(next).toHaveBeenCalledWith();
  });
});

const errorUtils = require("../../src/utils/errorUtils");

describe("errorUtils", () => {
  it("should create a 400 error", () => {
    try {
      errorUtils.throwError400("Bad Request");
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.statusCode).toBe(400);
      expect(err.message).toBe("Bad Request");
    }
  });

  it("should create a 404 error", () => {
    try {
      errorUtils.throwError404("Not Found");
    } catch (err) {
      expect(err.statusCode).toBe(404);
    }
  });

  it("should create a 500 error", () => {
    try {
      errorUtils.internalServerError("Server Error");
    } catch (err) {
      expect(err.statusCode).toBe(500);
    }
  });
});

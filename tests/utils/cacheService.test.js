jest.useFakeTimers();

const cacheService = require("../../src/services/cacheService");

describe("cacheService", () => {
  afterEach(() => {
    cacheService.clear();
    jest.clearAllTimers();
  });

  it("should store and retrieve value before TTL expires", () => {
    cacheService.set("testKey", "testValue", 1000);

    const value = cacheService.get("testKey");
    expect(value).toBe("testValue");
  });

  it("should return null after TTL expires", () => {
    cacheService.set("expireKey", "value", 1000);

    jest.advanceTimersByTime(1001);

    const value = cacheService.get("expireKey");
    expect(value).toBeNull();
  });

  it("should delete a key", () => {
    cacheService.set("deleteKey", "value", 1000);
    cacheService.delete("deleteKey");

    const value = cacheService.get("deleteKey");
    expect(value).toBeNull();
  });
});

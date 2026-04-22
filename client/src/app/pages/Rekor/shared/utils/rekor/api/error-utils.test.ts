import { ApiError } from "rekor";
import { isNetworkError, isApiError } from "./error-utils";

describe("isNetworkError", () => {
  it("returns true for TypeError with 'Failed to fetch' message", () => {
    expect(isNetworkError(new TypeError("Failed to fetch"))).toBe(true);
  });

  it("returns false for TypeError with other message", () => {
    expect(isNetworkError(new TypeError("other"))).toBe(false);
  });

  it("returns false for non-TypeError", () => {
    expect(isNetworkError(new Error("Failed to fetch"))).toBe(false);
  });

  it("returns false for non-Error values", () => {
    expect(isNetworkError(null)).toBe(false);
    expect(isNetworkError("Failed to fetch")).toBe(false);
  });
});

describe("isApiError", () => {
  it("returns true for ApiError instance", () => {
    const err = new ApiError(
      { url: "http://rekor/api", ok: false, status: 500, statusText: "Internal Server Error", body: {} },
      "request error"
    );
    expect(isApiError(err)).toBe(true);
  });

  it("returns false for plain Error", () => {
    expect(isApiError(new Error("fail"))).toBe(false);
  });

  it("returns false for non-Error values", () => {
    expect(isApiError(null)).toBe(false);
    expect(isApiError("string")).toBe(false);
  });
});

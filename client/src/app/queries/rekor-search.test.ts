import { ApiError } from "rekor";
import { shouldRetry } from "./rekor-search";

describe("shouldRetry", () => {
  it("returns false when failureCount exceeds retry limit", () => {
    expect(shouldRetry(6, new Error("any"))).toBe(false);
  });

  it("returns false for network error when offline", () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    expect(shouldRetry(0, new TypeError("Failed to fetch"))).toBe(false);
  });

  it("returns true for network error when online", () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
    expect(shouldRetry(0, new TypeError("Failed to fetch"))).toBe(true);
  });

  it("returns false for 4xx ApiError", () => {
    const err = new ApiError(
      { url: "http://rekor/api", ok: false, status: 422, statusText: "Unprocessable Entity", body: {} },
      "request error"
    );
    expect(shouldRetry(0, err)).toBe(false);
  });

  it("returns true for 5xx ApiError", () => {
    const err = new ApiError(
      { url: "http://rekor/api", ok: false, status: 503, statusText: "Service Unavailable", body: {} },
      "request error"
    );
    expect(shouldRetry(0, err)).toBe(true);
  });

  it("returns true for unknown error types", () => {
    expect(shouldRetry(0, new Error("unknown"))).toBe(true);
  });
});

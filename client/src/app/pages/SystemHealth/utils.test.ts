import { describe, expect, it } from "vitest";
import { getOverallStatus, overallStatusToSeverity } from "./utils";

describe("getOverallStatus", () => {
  it("returns Operational when all services are healthy", () => {
    expect(getOverallStatus(["healthy", "healthy", "healthy"])).toBe("Operational");
  });

  it("returns Down when all services are unhealthy", () => {
    expect(getOverallStatus(["unhealthy", "unhealthy", "unhealthy"])).toBe("Down");
  });

  it("returns Degraded when services have mixed statuses", () => {
    expect(getOverallStatus(["healthy", "unhealthy", "healthy"])).toBe("Degraded");
    expect(getOverallStatus(["healthy", "unknown", "healthy"])).toBe("Degraded");
    expect(getOverallStatus(["unhealthy", "unknown", "unhealthy"])).toBe("Degraded");
  });
});

describe("overallStatusToSeverity", () => {
  it("maps Operational to success", () => {
    expect(overallStatusToSeverity("Operational")).toBe("success");
  });

  it("maps Degraded to warning", () => {
    expect(overallStatusToSeverity("Degraded")).toBe("warning");
  });

  it("maps Down to danger", () => {
    expect(overallStatusToSeverity("Down")).toBe("danger");
  });
});

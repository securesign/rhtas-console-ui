import { expect } from "../../assertions";
import { test } from "../../fixtures";

const isObservabilityEnabled = process.env.FEATURE_OBSERVABILITY === "on";

test.describe("Observability - Feature flag", () => {
  test(`sidebar link is ${isObservabilityEnabled ? "visible" : "hidden"}`, async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: "Observability" });

    if (isObservabilityEnabled) {
      await expect(link).toBeVisible();
      await link.click();
      await expect(page.getByRole("heading", { level: 1, name: "Observability" })).toBeVisible();
    } else {
      await expect(link).not.toBeVisible();
    }
  });

  test(`page is ${isObservabilityEnabled ? "accessible" : "not accessible"} via direct URL`, async ({ page }) => {
    await page.goto("/observability");
    const heading = page.getByRole("heading", { level: 1, name: "Observability" });

    if (isObservabilityEnabled) {
      await expect(heading).toBeVisible();
    } else {
      await expect(heading).not.toBeVisible();
    }
  });
});

import { expect } from "../../assertions";
import { test } from "../../fixtures";

const isMonitoringAlertingEnabled = process.env.FEATURE_MONITORING === "on";

test.describe("Monitoring - Feature flag", () => {
  test(`sidebar link is ${isMonitoringAlertingEnabled ? "visible" : "hidden"}`, async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: "Trust Coverage" });

    if (isMonitoringAlertingEnabled) {
      await expect(link).toBeVisible();
      await link.click();
      await expect(page.getByRole("heading", { level: 1, name: "Trust Coverage" })).toBeVisible();
    } else {
      await expect(link).not.toBeVisible();
    }
  });

  test(`page is ${isMonitoringAlertingEnabled ? "accessible" : "not accessible"} via direct URL`, async ({ page }) => {
    await page.goto("/monitoring");
    const heading = page.getByRole("heading", { level: 1, name: "Trust Coverage" });

    if (isMonitoringAlertingEnabled) {
      await expect(heading).toBeVisible();
    } else {
      await expect(heading).not.toBeVisible();
    }
  });
});

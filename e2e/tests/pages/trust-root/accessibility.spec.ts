import { expect } from "../../assertions";
import { test } from "../../fixtures";

import AxeBuilder from "@axe-core/playwright";

import { TrustRootPage } from "./TrustRootPage";

test.describe("Trust Root - Accessibility", () => {
  test("Page view: Overview tab", async ({ page }) => {
    const trustRootPage = await TrustRootPage.build(page);
    await trustRootPage.getTabs().select("Overview");
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Page view: Certificates tab", async ({ page }) => {
    const trustRootPage = await TrustRootPage.build(page);
    await trustRootPage.getTabs().select("Certificates");
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Page view: Root details tab", async ({ page }) => {
    const trustRootPage = await TrustRootPage.build(page);
    await trustRootPage.getTabs().select("Root details");
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

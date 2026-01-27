import AxeBuilder from "@axe-core/playwright";

import { expect } from "../../assertions";
import { test } from "../../fixtures";

import { RekorSearchPage } from "./RekorSearchPage";

test.describe("Rekor Search UI - Accessability", () => {
  test("Default Page view", async ({ page }) => {
    await RekorSearchPage.build(page);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Page view after search", async ({ page }) => {
    const rekorSearchPage = await RekorSearchPage.build(page);
    await rekorSearchPage.applySearch(
      "Entry UUID",
      "108e9186e8c5677a023bef8fb7d3eb499b3df47f26592175c2fd51442d6e14a45591b1e5d4dcff24"
    );

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Page view after failed search", async ({ page }) => {
    const rekorSearchPage = await RekorSearchPage.build(page);
    await rekorSearchPage.applySearch(
      "Entry UUID",
      "108e9186e8c5677a023bef8fb7d3eb499b3df47f26592175c2fd51442d6e14a45591b1e5d4dcff24error"
    );

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

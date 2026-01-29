import { runA11yAudit } from "../../common/a11y";
import { test } from "../../fixtures";

import { RekorSearchPage } from "./RekorSearchPage";

test.describe("Rekor Search UI - Accessibility", () => {
  test("Default Page view", async ({ page }, testInfo) => {
    await RekorSearchPage.build(page);
    await runA11yAudit(page, testInfo, { label: "rekor-default" });
  });

  test("Page view after search", async ({ page }, testInfo) => {
    const rekorSearchPage = await RekorSearchPage.build(page);
    await rekorSearchPage.applySearch(
      "Entry UUID",
      "108e9186e8c5677a023bef8fb7d3eb499b3df47f26592175c2fd51442d6e14a45591b1e5d4dcff24"
    );

    await runA11yAudit(page, testInfo, { label: "rekor-search" });
  });

  test("Page view after failed search", async ({ page }, testInfo) => {
    const rekorSearchPage = await RekorSearchPage.build(page);
    await rekorSearchPage.applySearch(
      "Entry UUID",
      "108e9186e8c5677a023bef8fb7d3eb499b3df47f26592175c2fd51442d6e14a45591b1e5d4dcff24error"
    );

    await runA11yAudit(page, testInfo, { label: "rekor-failed-search" });
  });
});

import { runA11yAudit } from "../../common/a11y";
import { test } from "../../fixtures";

import { RekorEntryPage } from "./RekorEntryPage";

const LOG_INDEX = "380502080";

test.describe("Rekor Entry - Accessibility", () => {
  test("Default page view", async ({ page }, testInfo) => {
    await RekorEntryPage.buildDirect(page, LOG_INDEX);
    await runA11yAudit(page, testInfo, { label: "rekor-entry-default" });
  });

  test("Page view with Raw Body expanded", async ({ page }, testInfo) => {
    const entryPage = await RekorEntryPage.buildDirect(page, LOG_INDEX);
    await entryPage.toggleAccordionItem("Raw Body");
    await runA11yAudit(page, testInfo, { label: "rekor-entry-raw-body" });
  });
});

import { runA11yAudit } from "../../common/a11y";
import { test } from "../../fixtures";

import { TrustRootPage } from "./TrustRootPage";

test.describe("Trust Root - Accessibility", () => {
  test("Page view: Overview tab", async ({ page }, testInfo) => {
    const trustRootPage = await TrustRootPage.build(page);
    await trustRootPage.getTabs().select("Overview");
    await runA11yAudit(page, testInfo, { label: "trust-root-overview" });
  });

  test("Page view: Certificates tab", async ({ page }, testInfo) => {
    const trustRootPage = await TrustRootPage.build(page);
    await trustRootPage.getTabs().select("Certificates");
    await runA11yAudit(page, testInfo, { label: "trust-root-certificates" });
  });

  test("Page view: Root details tab", async ({ page }, testInfo) => {
    const trustRootPage = await TrustRootPage.build(page);
    await trustRootPage.getTabs().select("Root details");
    await runA11yAudit(page, testInfo, { label: "trust-root-root-details" });
  });
});

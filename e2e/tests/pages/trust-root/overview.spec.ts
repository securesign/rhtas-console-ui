import { expect } from "../../assertions";
import { test } from "../../fixtures";

import { TrustRootPage } from "./TrustRootPage";

test.describe("Trust Root - Overview", () => {
  test("DonutChart should be visible", async ({ page }) => {
    const trustRootPage = await TrustRootPage.build(page);

    // Select Overview Tab
    const tabContent = await trustRootPage.getTabs().select("Overview");

    // Verify card areas are visible
    await expect(tabContent).toContainText("Certificate health");
    await expect(tabContent).toContainText("Expiring soon");
  });
});

import { expect, test } from "@playwright/test";

import { RekorSearchPage } from "./RekorSearchPage";

test.describe("Overriding the Rekor Endpoint", () => {
  test("Should use the fallback endpoint if one is not provided", async ({ page }) => {
    const rekorSearchPage = await RekorSearchPage.build(page);
    await rekorSearchPage.applySearch("Email", "carlosthe19916@gmail.com");

    // Open settings modal
    await page.getByTestId("settings-button").click();

    // Verify default values
    await expect(page.locator("#rekor-endpoint-override")).toHaveValue("https://rekor.sigstore.dev");

    // Close settings modal
    await page.getByTestId("settings-close-button").click();

    // Verify search
    const response = await page.waitForResponse((response) => {
      return response.url().startsWith("https://rekor.sigstore.dev") && response.request().method() === "GET";
    });

    await rekorSearchPage.applySearch("Email", "bob.callaway@gmail.com");

    expect(response.url()).toContain("https://rekor.sigstore.dev");
  });
});

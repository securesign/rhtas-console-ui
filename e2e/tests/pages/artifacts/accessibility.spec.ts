import { expect } from "../../assertions";
import { runA11yAudit } from "../../common/a11y";
import { test } from "../../fixtures";

import { ArtifactsPage } from "./ArtifactsPage";

test.describe("Artifacts page Accessibility", () => {
  test("Default page view", async ({ page }, testInfo) => {
    await ArtifactsPage.build(page);
    await runA11yAudit(page, testInfo, { label: "artifacts-default" });
  });

  test("Page view after search", async ({ page }, testInfo) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact("ttl.sh/rhtas/console-test-image");

    await runA11yAudit(page, testInfo, { label: "artifacts-search" });
  });

  test("Page view after expanding signature", async ({ page }, testInfo) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact("ttl.sh/rhtas/console-test-image");

    await artifactsPage.expandSignaturesCard();

    const sigTable = page.locator('table[aria-label="Signatures Table"]');
    await expect(sigTable).toBeVisible();

    const firstRowToggle = sigTable.locator("tbody tr td.pf-v6-c-table__toggle button").first();
    await firstRowToggle.click();

    await runA11yAudit(page, testInfo, { label: "artifacts-signature-expanded" });
  });

  test("Page view after expanding attestation", async ({ page }, testInfo) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact("ttl.sh/rhtas/console-test-image");

    await artifactsPage.expandAttestationsCard();

    const attTable = page.locator('table[aria-label="Artifact Attestation Table"]');
    await expect(attTable).toBeVisible();

    const firstRowToggle = attTable.locator("tbody tr td.pf-v6-c-table__toggle button").first();
    await firstRowToggle.click();

    await runA11yAudit(page, testInfo, { label: "artifacts-attestation-expanded" });
  });
});

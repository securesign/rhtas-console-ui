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

    const tabs = artifactsPage.getTabs();
    const tabContent = await tabs.select("Signatures");

    const firstSignature = tabContent.getByRole("list", { name: "Signatures list" }).getByRole("listitem").first();
    const firstSignatureDetailsToggle = firstSignature.locator('button[aria-label="Details"]');
    await firstSignatureDetailsToggle.click();
    await expect(firstSignatureDetailsToggle).toHaveAttribute("aria-expanded", "true");

    await runA11yAudit(page, testInfo, { label: "artifacts-signature-expanded" });
  });

  test("Page view after expanding attestation", async ({ page }, testInfo) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact("ttl.sh/rhtas/console-test-image");

    const tabs = artifactsPage.getTabs();
    const tabContent = await tabs.select("Attestations");

    const firstAttestation = tabContent
      .getByRole("list", { name: "Artifact attestations list" })
      .getByRole("listitem")
      .first();
    const firstAttestationDetailsToggle = firstAttestation.locator('button[aria-label="Details"]');
    await firstAttestationDetailsToggle.click();
    await expect(firstAttestationDetailsToggle).toHaveAttribute("aria-expanded", "true");

    await runA11yAudit(page, testInfo, { label: "artifacts-attestation-expanded" });
  });
});

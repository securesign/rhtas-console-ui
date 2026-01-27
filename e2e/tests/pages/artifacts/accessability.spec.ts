import AxeBuilder from "@axe-core/playwright";

import { expect } from "../../assertions";
import { test } from "../../fixtures";

import { ArtifactsPage } from "./ArtifactsPage";

test.describe("Artifacts page Accessability", () => {
  test("Default page view", async ({ page }) => {
    await ArtifactsPage.build(page);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Page view after search", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact("ttl.sh/rhtas/console-test-image");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Page view after expanding signature", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact("ttl.sh/rhtas/console-test-image");

    const tabs = artifactsPage.getTabs();
    const tabContent = await tabs.select("Signatures");

    const firstSignature = tabContent.getByRole("list", { name: "Signatures list" }).getByRole("listitem").first();
    const firstSignatureDetailsToggle = firstSignature.locator('button[aria-label="Details"]');
    await firstSignatureDetailsToggle.click();
    await expect(firstSignatureDetailsToggle).toHaveAttribute("aria-expanded", "true");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Page view after expanding attestation", async ({ page }) => {
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

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

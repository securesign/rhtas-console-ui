import { expect as baseExpect } from "@playwright/test";

import { expect } from "../../assertions";
import { test } from "../../fixtures";

import { ArtifactsPage } from "./ArtifactsPage";

test.describe("Artifacts Verification Flow", () => {
  test("Complete flow: input -> verification -> result display", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact("docker.io/library/nginx:1.29.4");

    // Verify results are displayed
    await expect(page.getByText("Showing 1 of 1")).toBeVisible();
  });

  test("User can view artifact metadata fields in summary", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact("docker.io/library/nginx:1.29.4");

    // Verify metadata fields are visible
    await expect(page.locator("dt", { hasText: "Digest" }).locator("+ dd", { hasText: /^sha256:.+/ })).toBeVisible();
    await expect(page.locator("dt", { hasText: "Size" }).locator("+ dd", { hasText: /\d+/ })).toBeVisible();
    await expect(
      page
        .locator("dt", { hasText: "Labels" })
        .locator("+ dd", { hasText: "NGINX Docker Maintainers <docker-maint@nginx.com>" })
    ).toBeVisible();
    await expect(page.locator("dt", { hasText: "Signatures" }).locator("+ dd", { hasText: /^\d+$/ })).toBeVisible();
    await expect(page.locator("dt", { hasText: "Rekor Entries" }).locator("+ dd", { hasText: /^\d+$/ })).toBeVisible();
    await expect(
      page
        .locator("dt", { hasText: "Media Type" })
        .locator("+ dd", { hasText: "application/vnd.oci.image.index.v1+json" })
    ).toBeVisible();
    await expect(
      page.locator("dt", { hasText: "Created" }).locator("+ dd", { hasText: /[A-Za-z]{3} \d{1,2}, \d{4}/ })
    ).toBeVisible();
    await expect(page.locator("dt", { hasText: "Attestations" }).locator("+ dd", { hasText: /^\d+$/ })).toBeVisible();
    await expect(
      page.locator("dt", { hasText: "Time Coherence" }).locator("+ dd", { hasText: "unknown" })
    ).toBeVisible();
  });

  test("User can navigate to registry by clicking on card title", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact("docker.io/library/nginx:1.29.4");

    const cardHeader = await artifactsPage.getArtifactCardHeader();
    const artifactLink = cardHeader.getByRole("link");

    await expect(artifactLink).toHaveAttribute("href", "https://docker.io/library/nginx:1.29.4");
    await expect(artifactLink).toHaveAttribute("target", "_blank");
  });

  test("User has clear indicator of overall verification status of the artifact", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact("docker.io/library/nginx:1.29.4");

    const cardHeader = await artifactsPage.getArtifactCardHeader();
    await expect(cardHeader.locator(".pf-v6-c-label", { hasText: "Not signed" })).toBeVisible();
  });

  test("User has clear indicator of verification status per signature", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact("ttl.sh/rhtas/console-test-image");

    // Expand the Signatures card
    await artifactsPage.expandSignaturesCard();

    // User can see all signatures in the table
    const sigTable = page.locator('table[aria-label="Signatures Table"]');
    await expect(sigTable).toBeVisible();

    // Get main data rows (those with expand toggle cells, not expandable content rows)
    const dataRows = sigTable.locator("tbody tr").filter({
      has: page.locator("td.pf-v6-c-table__toggle"),
    });
    await baseExpect.poll(() => dataRows.count()).toBeGreaterThanOrEqual(2);

    // Verify first signature row has verification status icons (CheckIcon/TimesIcon SVGs)
    await expect(dataRows.first().locator("svg").first()).toBeVisible();
  });

  test("User has clear indicator of verification status per attestation", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact("ttl.sh/rhtas/console-test-image");

    // Expand the Attestations card
    await artifactsPage.expandAttestationsCard();

    // User can see all attestations in the table
    const attTable = page.locator('table[aria-label="Artifact Attestation Table"]');
    await expect(attTable).toBeVisible();

    // Get main data rows (those with expand toggle cells, not expandable content rows)
    const dataRows = attTable.locator("tbody tr").filter({
      has: page.locator("td.pf-v6-c-table__toggle"),
    });
    await baseExpect.poll(() => dataRows.count()).toBeGreaterThanOrEqual(1);

    // Verify first attestation row has verification status icons (CheckIcon/TimesIcon SVGs)
    await expect(dataRows.first().locator("svg").first()).toBeVisible();
  });
});

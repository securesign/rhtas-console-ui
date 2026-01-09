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
    await expect(page.locator("dt", { hasText: "Digest" }).locator("+ dd", { hasText: "sha256:8c329" })).toBeVisible();
    await expect(page.locator("dt", { hasText: "Size" }).locator("+ dd", { hasText: "10229" })).toBeVisible();
    await expect(
      page
        .locator("dt", { hasText: "Labels" })
        .locator("+ dd", { hasText: "NGINX Docker Maintainers <docker-maint@nginx.com>" })
    ).toBeVisible();
    await expect(
      page.locator("dt", { hasText: "Signatures" }).locator("+ dd", { hasText: "0 Signatures" })
    ).toBeVisible();
    await expect(
      page.locator("dt", { hasText: "Rekor Entries" }).locator("+ dd", { hasText: "0 Rekor Entries" })
    ).toBeVisible();
    await expect(
      page
        .locator("dt", { hasText: "Media Type" })
        .locator("+ dd", { hasText: "application/vnd.oci.image.index.v1+json" })
    ).toBeVisible();
    await expect(page.locator("dt", { hasText: "Created" }).locator("+ dd", { hasText: "Dec 29, 2025" })).toBeVisible();
    await expect(
      page.locator("dt", { hasText: "Attestations" }).locator("+ dd", { hasText: "0 Attestations" })
    ).toBeVisible();
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

    // Ensure we're on the Signatures tab
    const tabs = artifactsPage.getTabs();
    const tabContent = await tabs.select("Signatures");

    // User can see all signatures associated with the artifact
    const signatures = tabContent.getByRole("list", { name: "Signatures list" }).getByRole("listitem");
    await baseExpect.poll(() => signatures.count()).toBeGreaterThanOrEqual(2);

    // Verify first signature has verification status
    await expect(signatures.first()).toHaveText(/[✓✗]/);
  });

  test("User has clear indicator of verification status per attestation", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact("ttl.sh/rhtas/console-test-image");

    // Switch to Attestations tab
    const tabs = artifactsPage.getTabs();
    const tabContent = await tabs.select("Attestations");

    // User can see all attestations associated with the artifact
    const attestations = tabContent.getByRole("list", { name: "Artifact attestations list" }).getByRole("listitem");
    await baseExpect.poll(() => attestations.count()).toBeGreaterThanOrEqual(1);

    // Verify first attestation has verification status
    await expect(attestations.first()).toHaveText(/[✓✗]/);
  });
});

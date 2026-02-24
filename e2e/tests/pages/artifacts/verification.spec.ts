import { expect as baseExpect } from "@playwright/test";

import { expect } from "../../assertions";
import { test } from "../../fixtures";

import { ArtifactsPage } from "./ArtifactsPage";

// Test images on quay.io - permanent, no rate limits
const UNSIGNED_IMAGE = "quay.io/rh_ee_kdacosta/console-test-unsigned:v1";
const SIGNED_IMAGE = "quay.io/rh_ee_kdacosta/console-test-signed:v1";

test.describe("Artifacts Verification Flow", () => {
  test("Complete flow: input -> verification -> result display", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact(UNSIGNED_IMAGE);

    // Verify results are displayed
    await expect(page.getByText("Showing 1 of 1")).toBeVisible();
  });

  test("User can view artifact metadata fields in summary", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact(UNSIGNED_IMAGE);

    // Verify metadata fields are visible
    await expect(page.locator("dt", { hasText: "Digest" }).locator("+ dd", { hasText: /^sha256:.+/ })).toBeVisible();
    await expect(page.locator("dt", { hasText: "Size" }).locator("+ dd", { hasText: /\d+/ })).toBeVisible();
    await expect(
      page.locator("dt", { hasText: "Labels" }).locator("+ dd", { hasText: "kdacosta@redhat.com" })
    ).toBeVisible();
    await expect(page.locator("dt", { hasText: "Signatures" }).locator("+ dd", { hasText: /^\d+$/ })).toBeVisible();
    await expect(page.locator("dt", { hasText: "Rekor Entries" }).locator("+ dd", { hasText: /^\d+$/ })).toBeVisible();
    await expect(
      page
        .locator("dt", { hasText: "Media Type" })
        .locator("+ dd", { hasText: "application/vnd.oci.image.manifest.v1+json" })
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
    await artifactsPage.searchArtifact(UNSIGNED_IMAGE);

    const cardHeader = await artifactsPage.getArtifactCardHeader();
    const artifactLink = cardHeader.getByRole("link");

    await expect(artifactLink).toHaveAttribute("href", `https://${UNSIGNED_IMAGE}`);
    await expect(artifactLink).toHaveAttribute("target", "_blank");
  });

  test("User has clear indicator of overall verification status of the artifact", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact(UNSIGNED_IMAGE);

    const cardHeader = await artifactsPage.getArtifactCardHeader();
    await expect(cardHeader.locator(".pf-v6-c-label", { hasText: "Not signed" })).toBeVisible();
  });

  test("User has clear indicator of verification status per signature", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact(SIGNED_IMAGE);

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
    await artifactsPage.searchArtifact(SIGNED_IMAGE);

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

  test("User can see the signing/leaf certificate for each signature", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact(SIGNED_IMAGE);

    // Expand the Signatures card
    await artifactsPage.expandSignaturesCard();

    // Find the signatures table and expand the first row
    const sigTable = page.locator('table[aria-label="Signatures Table"]');
    await expect(sigTable).toBeVisible();

    const dataRows = sigTable.locator("tbody tr").filter({
      has: page.locator("td.pf-v6-c-table__toggle"),
    });
    await baseExpect.poll(() => dataRows.count()).toBeGreaterThanOrEqual(1);

    await dataRows.first().locator("td.pf-v6-c-table__toggle button").click();

    // Verify Leaf Certificate card is visible within the expanded row
    const leafCertCard = sigTable.locator(".pf-v6-c-card", { hasText: "Leaf Certificate" }).first();
    await expect(leafCertCard).toBeVisible();

    // Verify all expected certificate fields are present with values
    await expect(leafCertCard.locator("dt", { hasText: "SAN" }).locator("+ dd", { hasText: /.+@.+/ })).toBeVisible();
    await expect(
      leafCertCard.locator("dt", { hasText: "Issuer" }).locator("+ dd", { hasText: /sigstore/ })
    ).toBeVisible();
    await expect(
      leafCertCard
        .locator("dt", { hasText: "Validity" })
        .locator("+ dd", { hasText: /\w{3}\s+\d{1,2},\s+\d{4}\s+→\s+\w{3}\s+\d{1,2},\s+\d{4}/ })
    ).toBeVisible();
    await expect(leafCertCard.locator("dt", { hasText: "Serial" }).locator("+ dd", { hasText: /\d+/ })).toBeVisible();
    await expect(
      leafCertCard.locator("dt", { hasText: "Fingerprint" }).locator("+ dd", { hasText: /[0-9a-f:]+/i })
    ).toBeVisible();
  });

  test("User can see the Rekor entry for each signature", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact(SIGNED_IMAGE);

    // Expand the Signatures card
    await artifactsPage.expandSignaturesCard();

    // Find the signatures table and expand the first row
    const sigTable = page.locator('table[aria-label="Signatures Table"]');
    await expect(sigTable).toBeVisible();

    const dataRows = sigTable.locator("tbody tr").filter({
      has: page.locator("td.pf-v6-c-table__toggle"),
    });
    await baseExpect.poll(() => dataRows.count()).toBeGreaterThanOrEqual(1);

    await dataRows.first().locator("td.pf-v6-c-table__toggle button").click();

    // Verify Rekor Entry card is visible within the expanded row
    const rekorEntryCard = sigTable.locator(".pf-v6-c-card", { hasText: "Rekor Entry" }).first();
    await expect(rekorEntryCard).toBeVisible();

    // Verify all expected Rekor entry fields are present with values
    await expect(
      rekorEntryCard.locator("dt", { hasText: "Entry Type" }).locator("+ dd", { hasText: "hashedrekord" })
    ).toBeVisible();
    // Date format varies by browser: Chromium/Firefox use comma, WebKit uses "at"
    await expect(
      rekorEntryCard
        .locator("dt", { hasText: "Integrated Time" })
        .locator("+ dd", { hasText: /\w{3}\s+\d{1,2},\s+\d{4}(,|\s+at)\s+\d{1,2}:\d{2}\s+(AM|PM)/ })
    ).toBeVisible();
    await expect(rekorEntryCard.locator("dt", { hasText: "Log ID" }).locator("+ dd", { hasText: /=/ })).toBeVisible();
    await expect(
      rekorEntryCard.locator("dt", { hasText: "Log Index" }).locator("+ dd", { hasText: /\d+/ })
    ).toBeVisible();

    const setInput = rekorEntryCard
      .locator("dt", { hasText: "Signed Entry Timestamp" })
      .locator("+ dd")
      .locator("input");
    await expect(setInput).toBeVisible();
    await expect(setInput).toHaveValue(/^[0-9a-f]+$/i);

    await expect(
      rekorEntryCard.locator("dt", { hasText: "Entry" }).locator("+ dd", { hasText: "Open in Rekor Search" })
    ).toBeVisible();
  });

  test("User can navigate to Rekor Search from each Rekor entry via deep link", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact(SIGNED_IMAGE);

    // Expand the Signatures card
    await artifactsPage.expandSignaturesCard();

    // Find the signatures table and expand the first row
    const sigTable = page.locator('table[aria-label="Signatures Table"]');
    await expect(sigTable).toBeVisible();

    const dataRows = sigTable.locator("tbody tr").filter({
      has: page.locator("td.pf-v6-c-table__toggle"),
    });
    await baseExpect.poll(() => dataRows.count()).toBeGreaterThanOrEqual(1);

    await dataRows.first().locator("td.pf-v6-c-table__toggle button").click();

    // Find the Rekor Entry card and the link within the expanded row
    const rekorEntryCard = sigTable.locator(".pf-v6-c-card", { hasText: "Rekor Entry" }).first();
    const rekorSearchLink = rekorEntryCard.locator("a", { hasText: "Open in Rekor Search" });

    // Verify link has correct href with logIndex parameter
    await expect(rekorSearchLink).toHaveAttribute("href", /\/rekor-search\?logIndex=\d+/);
    await expect(rekorSearchLink).toHaveAttribute("target", "_blank");
  });

  test("User can see the certificate chain for each signature", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact(SIGNED_IMAGE);

    // Expand the Signatures card
    await artifactsPage.expandSignaturesCard();

    // Find the signatures table and expand the first row
    const sigTable = page.locator('table[aria-label="Signatures Table"]');
    await expect(sigTable).toBeVisible();

    const dataRows = sigTable.locator("tbody tr").filter({
      has: page.locator("td.pf-v6-c-table__toggle"),
    });
    await baseExpect.poll(() => dataRows.count()).toBeGreaterThanOrEqual(1);

    await dataRows.first().locator("td.pf-v6-c-table__toggle button").click();

    // Verify Certificate Chain card is visible within the expanded row
    const certChainCard = sigTable.locator(".pf-v6-c-card", { hasText: "Certificate Chain" }).first();
    await expect(certChainCard).toBeVisible();

    // Verify Intermediate and Root certificates are present in the accordion
    await expect(certChainCard.locator("button", { hasText: "Intermediate" })).toBeVisible();
    await expect(certChainCard.locator("button", { hasText: "Root" })).toBeVisible();

    // Expand and verify Intermediate certificate
    await certChainCard.locator("button", { hasText: "Intermediate" }).click();
    const intermediateContent = certChainCard
      .locator("[id^='cert-chain-expand-']")
      .filter({ hasText: /sigstore-intermediate/ });
    await expect(
      intermediateContent.locator("dt", { hasText: "Subject" }).locator("+ dd", { hasText: /sigstore-intermediate/ })
    ).toBeVisible();
    await expect(
      intermediateContent.locator("dt", { hasText: "Issuer" }).locator("+ dd", { hasText: /sigstore/ })
    ).toBeVisible();
    await expect(
      intermediateContent
        .locator("dt", { hasText: "Not Before" })
        .locator("+ dd", { hasText: /[A-Za-z]{3} \d{1,2}, \d{4}/ })
    ).toBeVisible();
    await expect(
      intermediateContent
        .locator("dt", { hasText: "Not After" })
        .locator("+ dd", { hasText: /[A-Za-z]{3} \d{1,2}, \d{4}/ })
    ).toBeVisible();
    await expect(
      intermediateContent.locator("dt", { hasText: "Serial Number" }).locator("+ dd", { hasText: /\d+/ })
    ).toBeVisible();
    await expect(
      intermediateContent.locator("dt", { hasText: "Is CA" }).locator("+ dd", { hasText: "Yes" })
    ).toBeVisible();
    const intermediatePemInput = intermediateContent.locator("dt", { hasText: "PEM" }).locator("+ dd").locator("input");
    await expect(intermediatePemInput).toBeVisible();
    await expect(intermediatePemInput).toHaveValue(/-----BEGIN CERTIFICATE-----/);

    // Collapse Intermediate and expand Root certificate
    await certChainCard.locator("button", { hasText: "Intermediate" }).click();
    await certChainCard.locator("button", { hasText: "Root" }).click();

    // Root content - filter by id pattern, exclude intermediate (Root has no "intermediate" in text)
    const rootContent = certChainCard
      .locator("[id^='cert-chain-expand-']")
      .filter({
        hasNot: page.locator("dd", { hasText: /intermediate/i }),
      })
      .filter({
        has: page.locator("dd", { hasText: /CN=sigstore,O=sigstore\.dev/ }),
      });
    await expect(
      rootContent.locator("dt", { hasText: "Subject" }).locator("+ dd", { hasText: /CN=sigstore,O=sigstore\.dev/ })
    ).toBeVisible();
    await expect(
      rootContent.locator("dt", { hasText: "Issuer" }).locator("+ dd", { hasText: /CN=sigstore,O=sigstore\.dev/ })
    ).toBeVisible();
    await expect(
      rootContent.locator("dt", { hasText: "Not Before" }).locator("+ dd", { hasText: /[A-Za-z]{3} \d{1,2}, \d{4}/ })
    ).toBeVisible();
    await expect(
      rootContent.locator("dt", { hasText: "Not After" }).locator("+ dd", { hasText: /[A-Za-z]{3} \d{1,2}, \d{4}/ })
    ).toBeVisible();
    await expect(
      rootContent.locator("dt", { hasText: "Serial Number" }).locator("+ dd", { hasText: /\d+/ })
    ).toBeVisible();
    await expect(rootContent.locator("dt", { hasText: "Is CA" }).locator("+ dd", { hasText: "Yes" })).toBeVisible();
    const rootPemInput = rootContent.locator("dt", { hasText: "PEM" }).locator("+ dd").locator("input");
    await expect(rootPemInput).toBeVisible();
    await expect(rootPemInput).toHaveValue(/-----BEGIN CERTIFICATE-----/);
  });

  test("User can copy the PEM value for the certificate chain", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact(SIGNED_IMAGE);

    // Expand the Signatures card
    await artifactsPage.expandSignaturesCard();

    // Find the signatures table and expand the first row
    const sigTable = page.locator('table[aria-label="Signatures Table"]');
    await expect(sigTable).toBeVisible();

    const dataRows = sigTable.locator("tbody tr").filter({
      has: page.locator("td.pf-v6-c-table__toggle"),
    });
    await baseExpect.poll(() => dataRows.count()).toBeGreaterThanOrEqual(1);

    await dataRows.first().locator("td.pf-v6-c-table__toggle button").click();

    // Find Certificate Chain card and expand Root
    const certChainCard = sigTable.locator(".pf-v6-c-card", { hasText: "Certificate Chain" }).first();
    await certChainCard.locator("button", { hasText: "Root" }).click();

    // Find copy button and verify it exists
    const copyButton = certChainCard.getByRole("button", { name: "Copy PEM" });
    await expect(copyButton).toBeVisible();

    // Click copy button and verify it remains functional
    await copyButton.click();
    await expect(copyButton).toBeEnabled();
  });

  test("User can download the raw bundle JSON for signatures", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact(SIGNED_IMAGE);

    // Expand the Signatures card
    await artifactsPage.expandSignaturesCard();

    // Find the signatures table
    const sigTable = page.locator('table[aria-label="Signatures Table"]');
    await expect(sigTable).toBeVisible();

    const dataRows = sigTable.locator("tbody tr").filter({
      has: page.locator("td.pf-v6-c-table__toggle"),
    });
    await baseExpect.poll(() => dataRows.count()).toBeGreaterThanOrEqual(1);

    const firstRow = dataRows.first();

    // Click kebab menu (3 dots) - aria-label is "Signature actions"
    const kebabMenu = firstRow.getByRole("button", { name: "Signature actions" });
    await expect(kebabMenu).toBeVisible();
    await kebabMenu.click();

    // Verify Download bundle option is visible in dropdown
    const downloadOption = page.getByRole("menuitem", { name: /download bundle/i });
    await expect(downloadOption).toBeVisible();
    await expect(downloadOption).toBeEnabled();

    // Set up download listener before clicking
    const downloadPromise = page.waitForEvent("download");
    await downloadOption.click();

    // Verify download was triggered
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.json$/);
  });

  test("Empty state is shown when artifact has no signatures or attestations", async ({ page }) => {
    const artifactsPage = await ArtifactsPage.build(page);
    await artifactsPage.searchArtifact(UNSIGNED_IMAGE);

    // Expand Signatures card and check for empty state
    await artifactsPage.expandSignaturesCard();
    const sigCard = page.locator(".pf-v6-c-card").filter({ hasText: /Signatures - \d+/ });
    await expect(sigCard.getByRole("heading", { name: "No data available" })).toBeVisible();

    // Expand Attestations card and check for empty state
    await artifactsPage.expandAttestationsCard();
    const attCard = page.locator(".pf-v6-c-card").filter({ hasText: /Attestations - \d+/ });
    await expect(attCard.getByRole("heading", { name: "No data available" })).toBeVisible();
  });
});

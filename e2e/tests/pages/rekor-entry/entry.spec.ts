import { expect } from "../../assertions";
import { test } from "../../fixtures";

import { RekorEntryPage } from "./RekorEntryPage";

const LOG_INDEX = "380502080";

test.describe("Rekor Entry Detail", () => {
  test("Navigate from search results via View details", async ({ page }) => {
    const entryPage = await RekorEntryPage.buildFromSearch(page, LOG_INDEX);

    await expect(entryPage.getLogDetailsCard()).toBeVisible();
    await expect(entryPage.getPublicKeyCertificateCard()).toBeVisible();
    await expect(entryPage.getSafetyGuardrailsCard()).toBeVisible();
  });

  test("Direct navigation by URL", async ({ page }) => {
    const entryPage = await RekorEntryPage.buildDirect(page, LOG_INDEX);

    await expect(entryPage.getLogDetailsCard()).toBeVisible();
  });

  test("Breadcrumb shows Logs link and current log index", async ({ page }) => {
    const entryPage = await RekorEntryPage.buildDirect(page, LOG_INDEX);

    const breadcrumb = entryPage.getBreadcrumb();
    await expect(breadcrumb.getByRole("link", { name: "Logs" })).toBeVisible();
    await expect(breadcrumb.getByText(LOG_INDEX)).toBeVisible();
  });

  test("Breadcrumb Logs link navigates back to search page", async ({ page }) => {
    const entryPage = await RekorEntryPage.buildDirect(page, LOG_INDEX);

    await entryPage.getBreadcrumb().getByRole("link", { name: "Logs" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Rekor Search" })).toBeVisible();
  });

  test("Log details card shows entry metadata", async ({ page }) => {
    const entryPage = await RekorEntryPage.buildDirect(page, LOG_INDEX);

    const card = entryPage.getLogDetailsCard();
    await expect(card.getByText("Type")).toBeVisible();
    await expect(card.getByText("Log index")).toBeVisible();
    await expect(card.getByText("Integrated time")).toBeVisible();
    await expect(card.getByText("Entry UUID")).toBeVisible();
    await expect(card.getByText("Hash", { exact: true })).toBeVisible();
    await expect(card.getByText("Signature", { exact: true })).toBeVisible();
  });

  test("Accordion: Raw Body can be expanded", async ({ page }) => {
    const entryPage = await RekorEntryPage.buildDirect(page, LOG_INDEX);

    const guardrailsCard = entryPage.getSafetyGuardrailsCard();
    const bodyContent = guardrailsCard.getByText("apiVersion");

    await expect(bodyContent).not.toBeVisible();

    await entryPage.toggleAccordionItem("Raw Body");

    await expect(bodyContent).toBeVisible();
  });
});

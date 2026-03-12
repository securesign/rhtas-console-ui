import type { Page } from "@playwright/test";
import { expect } from "../../assertions";
import { RekorSearchPage } from "../rekor-search/RekorSearchPage";

export class RekorEntryPage {
  private readonly _page: Page;

  private constructor(page: Page) {
    this._page = page;
  }

  static async buildFromSearch(page: Page, logIndex: string) {
    const rekorSearchPage = await RekorSearchPage.build(page);
    await rekorSearchPage.applySearch(logIndex);

    await page.getByRole("link", { name: "View details" }).first().click();
    await expect(page.getByRole("heading", { level: 1, name: logIndex })).toBeVisible();

    return new RekorEntryPage(page);
  }

  static async buildDirect(page: Page, logIndex: string) {
    await page.goto(`/rekor-search/${logIndex}`);
    await expect(page.getByRole("heading", { level: 1, name: logIndex })).toBeVisible();

    return new RekorEntryPage(page);
  }

  getLogDetailsCard() {
    return this._page.locator(".pf-v6-c-card", { hasText: "Log details" });
  }

  getPublicKeyCertificateCard() {
    return this._page.locator(".pf-v6-c-card", { hasText: "Public Key Certificate" });
  }

  getSafetyGuardrailsCard() {
    return this._page.locator(".pf-v6-c-card", { hasText: "Recommended safety guardrails" });
  }

  getBreadcrumb() {
    return this._page.locator("nav.pf-v6-c-breadcrumb");
  }

  async toggleAccordionItem(name: string) {
    await this._page.getByRole("button", { name }).click();
  }
}

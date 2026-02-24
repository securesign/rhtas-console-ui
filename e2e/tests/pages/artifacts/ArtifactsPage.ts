import type { Page } from "@playwright/test";
import { expect } from "../../assertions";
import { Navigation } from "../../common/Navigation";

export class ArtifactsPage {
  private readonly _page: Page;

  private constructor(page: Page) {
    this._page = page;
  }

  static async build(page: Page) {
    const navigation = Navigation.build(page);
    await navigation.goToSidebar("Artifacts");

    return new ArtifactsPage(page);
  }

  async searchArtifact(uri: string) {
    await this._page.getByLabel("Containerimage URI input field").fill(uri);
    await this._page.getByLabel("Containerimage URI input field").press("Enter");

    // Wait for results
    await expect(this._page.locator(".pf-v6-c-card__header", { hasText: "Artifact details" })).toBeVisible({
      timeout: 25000,
    });
  }

  async getArtifactCardHeader() {
    const cardHeader = this._page.locator(".pf-v6-c-card__header", { hasText: "Artifact details" });
    await expect(cardHeader).toBeVisible();
    return cardHeader;
  }

  async expandSignaturesCard() {
    const header = this._page.locator(".pf-v6-c-card__header", { hasText: /Signatures - \d+/ });
    await header.locator(".pf-v6-c-card__header-toggle button").click();
  }

  async expandAttestationsCard() {
    const header = this._page.locator(".pf-v6-c-card__header", { hasText: /Attestations - \d+/ });
    await header.locator(".pf-v6-c-card__header-toggle button").click();
  }
}

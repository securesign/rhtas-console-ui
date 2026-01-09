import type { Page } from "@playwright/test";
import { expect } from "../../assertions";
import { Navigation } from "../../common/Navigation";
import { Tabs } from "../../common/Tabs";

export class ArtifactsPage {
  private readonly _page: Page;
  private readonly _tabs: Tabs<["Signatures", "Attestations"]>;

  private constructor(page: Page) {
    this._page = page;
    this._tabs = Tabs.build(page, ["Signatures", "Attestations"]);
  }

  static async build(page: Page) {
    const navigation = Navigation.build(page);
    await navigation.goToSidebar("Artifacts");

    return new ArtifactsPage(page);
  }

  getTabs() {
    return this._tabs;
  }

  async searchArtifact(uri: string) {
    await this._page.getByLabel("uri input field").fill(uri);
    await this._page.getByRole("button", { name: "Search" }).click();

    // Wait for results
    await expect(this._page.locator(".pf-v6-c-card__header", { hasText: "Artifact:" })).toBeVisible({ timeout: 25000 });
  }

  async getArtifactCardHeader() {
    const cardHeader = this._page.locator(".pf-v6-c-card__header", { hasText: "Artifact:" });
    await expect(cardHeader).toBeVisible();
    return cardHeader;
  }
}

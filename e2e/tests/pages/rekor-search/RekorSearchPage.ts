import type { Page } from "@playwright/test";
import { Navigation } from "../../common/Navigation";

export class RekorSearchPage {
  private readonly _page: Page;

  private constructor(page: Page) {
    this._page = page;
  }

  static async build(page: Page) {
    const navigation = Navigation.build(page);
    await navigation.goToSidebar("Rekor Search");

    return new RekorSearchPage(page);
  }

  async applySearch(attribute: "Email" | "Hash" | "Entry SHA" | "Entry UUID" | "Log Index", value: string) {
    await this._page.locator("#rekor-search-attribute").selectOption(attribute);
    await this._page.locator(`[name="${attribute}"]`).fill(value);
    await this._page.getByRole("button", { name: "Search" }).click();
  }
}

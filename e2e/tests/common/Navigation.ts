import type { Page } from "playwright-core";

/**
 * Used to navigate to different pages
 */
export class Navigation {
  private readonly _page: Page;

  private constructor(page: Page) {
    this._page = page;
  }

  static build(page: Page) {
    return new Navigation(page);
  }

  async goToSidebar(menu: "Trust root" | "Artifacts" | "Rekor Search") {
    await this._page.goto("/");
    await this._page.getByRole("link", { name: menu }).click();
  }
}

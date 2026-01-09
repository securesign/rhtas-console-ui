import { type Page } from "@playwright/test";
import { expect } from "../assertions";

export class Tabs<TTabName extends readonly string[]> {
  private readonly _page: Page;
  private readonly _tabs: TTabName;

  private constructor(page: Page, tabs: TTabName) {
    this._page = page;
    this._tabs = tabs;
  }

  static build<const TTabs extends readonly string[]>(page: Page, tabs: TTabs) {
    return new Tabs(page, tabs);
  }

  /**
   * Select tab and return content
   * @param tabName
   */
  async select(tabName: TTabName[number]) {
    const tab = this._page.locator("button[role='tab']", { hasText: tabName });
    await expect(tab).toBeVisible();
    await tab.click();

    const tabContent = this._page.locator('section[role="tabpanel"]:not([hidden])');
    await expect(tabContent).toBeVisible();
    return tabContent;
  }
}

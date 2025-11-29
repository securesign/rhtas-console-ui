import { expect, type Page } from "@playwright/test";

export class Tabs<TTabs extends readonly string[]> {
  private readonly _page: Page;
  private readonly _tabs: TTabs;

  private constructor(page: Page, tabs: TTabs) {
    this._page = page;
    this._tabs = tabs;
  }

  static build<const TTabs extends readonly string[]>(page: Page, tabs: TTabs) {
    return new Tabs(page, tabs);
  }

  async select(tabName: TTabs[number]) {
    const tab = this._page.locator("button[role='tab']", { hasText: tabName });
    await expect(tab).toBeVisible();
    await tab.click();

    const tabContent = this._page.getByLabel(tabName, { exact: true });
    await expect(tabContent).toBeVisible();
    return tabContent;
  }
}

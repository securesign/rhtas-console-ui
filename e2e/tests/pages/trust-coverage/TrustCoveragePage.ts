import type { Page } from "@playwright/test";
import { Navigation } from "../../common/Navigation";

export class TrustCoveragePage {
  private readonly _page: Page;

  private constructor(page: Page) {
    this._page = page;
  }

  static async build(page: Page) {
    const navigation = Navigation.build(page);
    await navigation.goToSidebar("Trust Coverage");

    return new TrustCoveragePage(page);
  }
}

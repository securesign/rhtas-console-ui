import type { Page } from "@playwright/test";
import { Navigation } from "../../common/Navigation";

export class MonitoringPage {
  private readonly _page: Page;

  private constructor(page: Page) {
    this._page = page;
  }

  static async build(page: Page) {
    const navigation = Navigation.build(page);
    await navigation.goToSidebar("Monitoring");

    return new MonitoringPage(page);
  }
}

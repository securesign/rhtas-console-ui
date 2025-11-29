import { type Page } from "@playwright/test";
import { Navigation } from "../../common/Navigation";
import { Tabs } from "../../common/Tabs";

export class TrustRootPage {
  private readonly _page: Page;

  private constructor(page: Page) {
    this._page = page;
  }

  static async build(page: Page) {
    const navigation = Navigation.build(page);
    await navigation.goToSidebar("Trust root");

    return new TrustRootPage(page);
  }

  getTabs() {
    return Tabs.build(this._page, ["Overview", "Certificates", "Root details"]);
  }
}

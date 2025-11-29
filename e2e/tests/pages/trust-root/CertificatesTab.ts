import { type Page } from "@playwright/test";
import { Toolbar } from "../../common/Toolbar";
import { Table } from "../../common/Table";
import { Pagination } from "../../common/Pagination";

export class CertificatesTab {
  private readonly _page: Page;

  private constructor(_page: Page) {
    this._page = _page;
  }

  static build(_page: Page) {
    return new CertificatesTab(_page);
  }

  async getToolbar() {
    return await Toolbar.build(this._page, "certificates toolbar", { Subject: "string", Status: "multiSelect" });
  }

  async getTable() {
    return await Table.build(
      this._page,
      "certificates table",
      {
        Issuer: { isSortable: false },
        Subject: { isSortable: false },
        Target: { isSortable: false },
        Type: { isSortable: false },
        Status: { isSortable: false },
        Expiration: { isSortable: true },
      },
      ["Copy PEM", "Download PEM"]
    );
  }

  async getPagination(top = true) {
    return await Pagination.build(this._page, `certificates-table-pagination-${top ? "top" : "bottom"}`);
  }
}

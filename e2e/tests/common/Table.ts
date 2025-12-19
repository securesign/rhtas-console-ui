import { type Locator, type Page, expect } from "@playwright/test";

export interface TColumnValue {
  isSortable: boolean;
}

export class Table<
  TColumn extends Record<string, TColumnValue>,
  const TActions extends readonly string[],
  TColumnName extends Extract<keyof TColumn, string>,
> {
  private readonly _page: Page;
  _table: Locator;
  private readonly _columns: TColumn;
  private readonly _actions: TActions;

  protected type!: {
    ColumnName: Extract<keyof TColumn, string>;
  };

  private constructor(page: Page, table: Locator, columns: TColumn, actions: TActions) {
    this._page = page;
    this._table = table;
    this._columns = columns;
    this._actions = actions;
  }

  /**
   * @param page
   * @param tableAriaLabel the unique aria-label that corresponds to the DOM element that contains the Table. E.g. <table aria-label="identifier"></table>
   * @returns a new instance of a Toolbar
   */
  static async build<TColumn extends Record<string, TColumnValue>, const TActions extends readonly string[]>(
    page: Page,
    tableAriaLabel: string,
    columns: TColumn,
    actions: TActions
  ) {
    const table = page.locator(`table[aria-label="${tableAriaLabel}"]`);
    await expect(table).toBeVisible();

    const result = new Table(page, table, columns, actions);
    return result;
  }

  async clickSortBy(columnName: TColumnName) {
    await this._table.getByRole("button", { name: columnName, exact: true }).click();
  }

  async clickAction(actionName: TActions[number], rowIndex: number) {
    await this._table.locator(`button[aria-label="Kebab toggle"]`).nth(rowIndex).click();
    await this._page.getByRole("menuitem", { name: actionName }).click();
  }

  async getColumn(columnName: TColumnName) {
    const column = this._table.locator(`td[data-label="${columnName}"]`);
    await expect(column.first()).toBeVisible();
    return column;
  }

  async getColumnHeader(columnName: TColumnName) {
    const columnHeader = this._table.getByRole("columnheader", { name: columnName });
    await expect(columnHeader).toBeVisible();
    return columnHeader;
  }
}

import { expect as baseExpect } from "@playwright/test";
import type { Table, TColumnValue } from "../common/Table";
import { MatcherResult } from "./types";

export interface TableMatchers<
  TColumn extends Record<string, TColumnValue>,
  _TActions extends readonly string[],
  TColumnName extends Extract<keyof TColumn, string>,
> {
  toBeSortedBy(columnName: TColumnName, order: "ascending" | "descending"): Promise<MatcherResult>;
  toHaveColumnWithValue(columnName: TColumnName, value: string): Promise<MatcherResult>;
}

type TableMatcherDefinitions = {
  readonly [K in keyof TableMatchers<Record<string, TColumnValue>, [], string>]: <
    TColumn extends Record<string, TColumnValue>,
    const TActions extends readonly string[],
    TColumnName extends Extract<keyof TColumn, string>,
  >(
    receiver: Table<TColumn, TActions, TColumnName>,
    ...args: Parameters<TableMatchers<TColumn, TActions, TColumnName>[K]>
  ) => Promise<MatcherResult>;
};

export const tableAssertions = baseExpect.extend<TableMatcherDefinitions>({
  toBeSortedBy: async <
    TColumn extends Record<string, TColumnValue>,
    const TActions extends readonly string[],
    TColumnName extends Extract<keyof TColumn, string>,
  >(
    table: Table<TColumn, TActions, TColumnName>,
    columnName: TColumnName,
    order: "ascending" | "descending"
  ) => {
    try {
      const columnHeader = await table.getColumnHeader(columnName);
      await baseExpect(columnHeader).toHaveAttribute("aria-sort", order);

      return {
        pass: true,
        message: () => "Table is sorted by " + columnName + " in " + order + " order",
      };
    } catch (error) {
      return {
        pass: false,
        message: () => (error instanceof Error ? error.message : String(error)),
      };
    }
  },
  toHaveColumnWithValue: async <
    TColumn extends Record<string, TColumnValue>,
    const TActions extends readonly string[],
    TColumnName extends Extract<keyof TColumn, string>,
  >(
    table: Table<TColumn, TActions, TColumnName>,
    columnName: TColumnName,
    value: string
  ) => {
    try {
      await baseExpect(
        table._table
          .locator(`td[data-label="${columnName}"]`, {
            hasText: value,
          })
          .first()
      ).toBeVisible();

      return {
        pass: true,
        message: () => "Table contains " + value + " in column " + columnName,
      };
    } catch (error) {
      return {
        pass: false,
        message: () => (error instanceof Error ? error.message : String(error)),
      };
    }
  },
});

import { universalComparator } from "@app/utils/utils";
import type { ISortState } from "./useSortState";

/**
 * Args for getLocalSortDerivedState
 */
export interface ILocalSortDerivedStateArgs<TItem, TSortableColumnKey extends string> {
  /**
   * The data items before sorting
   */
  items: TItem[];

  /**
   * The "source of truth" state for the sort feature (returned by useSortState)
   */
  activeSort: ISortState<TSortableColumnKey>["activeSort"];

  /**
   * A callback function to return, for a given API data item, a record of sortable primitives for that item's sortable columns
   * - The record maps:
   *   - from `columnKey` values (the keys of the `columnNames` object passed to useTableControlState)
   *   - to easily sorted primitive values (string | number | boolean) for this item's value in that column
   */
  getSortValues?: (item: TItem) => Record<TSortableColumnKey, string | number | boolean>;
}

/**
 * Given the "source of truth" state for the sort feature and additional arguments, returns "derived state" values and convenience functions.
 * - For local/client-computed tables only. Performs the actual sorting logic, which is done on the server for server-computed tables.
 */
export const getLocalSortDerivedState = <TItem, TSortableColumnKey extends string>({
  items,
  getSortValues,
  activeSort,
}: ILocalSortDerivedStateArgs<TItem, TSortableColumnKey>) => {
  if (!getSortValues || !activeSort) {
    return { sortedItems: items };
  }

  const sortedItems = [...items].sort((a: TItem, b: TItem) => {
    const aValue = getSortValues(a)[activeSort.columnKey];
    const bValue = getSortValues(b)[activeSort.columnKey];
    const compareValue = universalComparator(aValue, bValue, "en");
    return activeSort.direction === "asc" ? compareValue : -compareValue;
  });

  return { sortedItems };
};

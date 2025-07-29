import React from "react";

/**
 * The currently applied sort parameters
 */
export interface IActiveSort<TSortableColumnKey extends string> {
  /**
   * The identifier for the currently sorted column (`columnKey` values come from the keys of the `columnNames` object passed to useTableControlState)
   */
  columnKey: TSortableColumnKey;
  /**
   * The direction of the currently applied sort (ascending or descending)
   */
  direction: "asc" | "desc";
}

/**
 * The "source of truth" state for the sort feature.
 */
export interface ISortState<TSortableColumnKey extends string> {
  /**
   * The currently applied sort column and direction
   */
  activeSort: IActiveSort<TSortableColumnKey> | null;
  /**
   * Updates the currently applied sort column and direction
   */
  setActiveSort: (sort: IActiveSort<TSortableColumnKey>) => void;
}

/**
 * Args for useSortState
 */
export interface ISortStateArgs<TSortableColumnKey extends string> {
  /**
   * The `columnKey` values (keys of the `columnNames` object passed to useTableControlState) corresponding to columns with sorting enabled
   */
  sortableColumns: TSortableColumnKey[];
  /**
   * The sort column and direction that should be applied by default when the table first loads
   */
  initialSort?: IActiveSort<TSortableColumnKey> | null;
}

/**
 * Provides the "source of truth" state for the sort feature.
 */
export const useSortState = <TSortableColumnKey extends string>(
  args: ISortStateArgs<TSortableColumnKey>
): ISortState<TSortableColumnKey> => {
  const initialSort = args.initialSort ?? null;

  const [activeSort, setActiveSort] = React.useState<IActiveSort<TSortableColumnKey> | null>(initialSort);

  return { activeSort, setActiveSort };
};

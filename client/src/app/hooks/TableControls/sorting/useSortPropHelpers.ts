import type { ThProps } from "@patternfly/react-table";
import type { ISortState } from "./useSortState";

/**
 * Args for useSortPropHelpers that come from outside useTableControlProps
 */
export interface ISortPropHelpersExternalArgs<TSortableColumnKey extends string> {
  /**
   * The "source of truth" state for the sort feature (returned by useSortState)
   */
  sortState: ISortState<TSortableColumnKey>;

  /**
   * The `columnKey` values (keys of the `columnNames` object passed to useTableControlState) corresponding to columns with sorting enabled
   */
  sortableColumns?: TSortableColumnKey[];
}

/**
 * Returns derived state and prop helpers for the sort feature based on given "source of truth" state.
 * - Used internally by useTableControlProps
 * - "Derived state" here refers to values and convenience functions derived at render time.
 */
export const useSortPropHelpers = <TSortableColumnKey extends string>(
  args: ISortPropHelpersExternalArgs<TSortableColumnKey>
) => {
  const {
    sortState: { activeSort, setActiveSort },
    sortableColumns = [],
  } = args;

  /**
   * Returns props for the Th component for a column with sorting enabled.
   */
  const getSortThProps = ({ columnKey }: { columnKey: TSortableColumnKey }): Pick<ThProps, "sort"> =>
    sortableColumns.includes(columnKey)
      ? {
          sort: {
            columnIndex: sortableColumns.indexOf(columnKey),
            sortBy: {
              index: activeSort ? sortableColumns.indexOf(activeSort.columnKey) : undefined,
              direction: activeSort?.direction,
            },
            onSort: (_event, index, direction) => {
              setActiveSort({
                columnKey: sortableColumns[index],
                direction,
              });
            },
          },
        }
      : {};

  return { getSortThProps };
};

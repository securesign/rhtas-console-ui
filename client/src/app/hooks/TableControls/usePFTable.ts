import { usePaginationPropHelpers } from "./pagination/usePaginationPropHelpers";
import { useSortPropHelpers } from "./sorting/useSortPropHelpers";
import { useTable, type ITableArgs } from "./useTable";

export const usePFTable = <TItem, TSortableColumnKey extends string, TFilterCategoryKey extends string>(
  args: ITableArgs<TItem, TSortableColumnKey, TFilterCategoryKey>
) => {
  const tableState = useTable(args);

  const { getSortThProps } = useSortPropHelpers({
    sortableColumns: args.sorting?.sortableColumns,
    sortState: tableState.sortingState,
  });

  const { paginationProps, paginationToolbarItemProps } = usePaginationPropHelpers({
    paginationState: tableState.paginationState,
    totalItemCount: tableState.tableState.totalItemCount,
    isLoading: false,
    isPaginationEnabled: true,
  });

  return {
    ...tableState,
    propHelpers: {
      getSortThProps,
      paginationProps,
      paginationToolbarItemProps,
    },
  };
};

import type { KeyWithValueType } from "@app/utils/type-utils";

import { useExpansionPropHelpers } from "./expansion/useExpansionPropHelpers";
import { useExpansionState } from "./expansion/useExpansionState";
import { usePaginationPropHelpers } from "./pagination/usePaginationPropHelpers";
import { useSortPropHelpers } from "./sorting/useSortPropHelpers";
import { useTable, type ITableArgs } from "./useTable";

export interface IPFTableArgs<TItem, TColumnKey extends string> {
  columns: TColumnKey[];
  idProperty: KeyWithValueType<TItem, string | number>;
}

export const usePFTable = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string,
>(
  args: ITableArgs<TItem, TSortableColumnKey, TFilterCategoryKey> & IPFTableArgs<TItem, TColumnKey>
) => {
  const tableState = useTable(args);

  const expansionState = useExpansionState<TColumnKey>();

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

  const { expansionDerivedState, getCompoundExpandTdProps, getSingleExpandButtonTdProps } = useExpansionPropHelpers<
    TItem,
    TColumnKey
  >({
    idProperty: args.idProperty,
    expansionState,
    columnKeys: args.columns,
  });

  return {
    ...tableState,
    propHelpers: {
      getSortThProps,
      paginationProps,
      paginationToolbarItemProps,
      getSingleExpandButtonTdProps,
      getCompoundExpandTdProps,
    },
    expansionDerivedState,
  };
};

import React from "react";

import { useFilterPropHelpers } from "./TableControls/filtering/useFilterPropHelpers";
import { usePFTable, type IPFTableArgs } from "./TableControls/usePFTable";
import { type ITableArgs } from "./TableControls/useTable";
import { useFilterControlPropHelpers } from "./ToolbarControls/useFilterControlPropHelpers";

export interface IPFToolbarTableArgs<TFilterCategoryKey extends string> {
  toolbar: {
    categoryTitles: Record<TFilterCategoryKey, string>;
  };
}

export const usePFToolbarTable = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string,
>(
  args: ITableArgs<TItem, TSortableColumnKey, TFilterCategoryKey> &
    IPFTableArgs<TItem, TColumnKey> &
    IPFToolbarTableArgs<TFilterCategoryKey>
) => {
  const [currentFilterCategoryKey, setCurrentFilterCategoryKey] = React.useState(
    args.filtering?.filterCategories?.[0].categoryKey
  );

  const { propHelpers, ...tableState } = usePFTable(args);

  const { toolbarProps, filterToolbarProps } = useFilterPropHelpers({
    filterCategories: args.filtering?.filterCategories,
    filterState: tableState.filteringState,
    currentFilterCategoryKey: currentFilterCategoryKey,
    setCurrentFilterCategoryKey: setCurrentFilterCategoryKey,
    categoryTitles: args.toolbar.categoryTitles,
  });

  const { getFilterControlProps } = useFilterControlPropHelpers({
    filterState: tableState.filteringState,
    categoryTitles: args.toolbar.categoryTitles,
  });

  return {
    ...tableState,
    propHelpers: {
      ...propHelpers,
      toolbarProps,
      filterToolbarProps: {
        ...filterToolbarProps,
        currentFilterCategoryKey,
        setCurrentFilterCategoryKey,
      },
      getFilterControlProps,
    },
  };
};

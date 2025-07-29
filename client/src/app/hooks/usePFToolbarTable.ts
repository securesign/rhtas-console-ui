import React from "react";

import { useFilterPropHelpers } from "./TableControls/filtering/useFilterPropHelpers";
import { usePFTable } from "./TableControls/usePFTable";
import { type ITableArgs } from "./TableControls/useTable";
import { useFilterControlPropHelpers } from "./ToolbarControls/useFilterControlPropHelpers";

export const usePFToolbarTable = <TItem, TSortableColumnKey extends string, TFilterCategoryKey extends string>(
  args: ITableArgs<TItem, TSortableColumnKey, TFilterCategoryKey> & {
    toolbar: {
      categoryTitles: Record<TFilterCategoryKey, string>;
    };
  }
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

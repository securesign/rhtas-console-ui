import type { ToolbarProps } from "@patternfly/react-core";

import type { IFilterToolbarProps } from "@app/components/FilterToolbar/FilterToolbar";

import type { IFilterCategory } from "./types";
import type { IFilterState } from "./useFilterState";

/**
 * Args for useFilterPropHelpers that come from outside useTableControlProps
 */
export interface IFilterPropHelpersExternalArgs<TItem, TFilterCategoryKey extends string> {
  /**
   * The "source of truth" state for the filter feature (returned by useFilterState)
   */
  filterState: IFilterState<TFilterCategoryKey>;
  /**
   * Definitions of the filters to be used (must include `getItemValue` functions for each category when performing filtering locally)
   */
  filterCategories?: IFilterCategory<TItem, TFilterCategoryKey>[];

  currentFilterCategoryKey?: TFilterCategoryKey;
  setCurrentFilterCategoryKey: (value: TFilterCategoryKey) => void;
  categoryTitles: Record<TFilterCategoryKey, string>;
}

/**
 * Returns derived state and prop helpers for the filter feature based on given "source of truth" state.
 */
export const useFilterPropHelpers = <TItem, TFilterCategoryKey extends string>(
  args: IFilterPropHelpersExternalArgs<TItem, TFilterCategoryKey>
) => {
  const {
    filterState: { setFilterValues },
    filterCategories = [],
    currentFilterCategoryKey,
    setCurrentFilterCategoryKey,
    categoryTitles,
  } = args;

  /**
   * Filter-related props for the PF Toolbar component
   */
  const toolbarProps: Omit<ToolbarProps, "ref"> = {
    collapseListedFiltersBreakpoint: "xl",
    clearAllFilters: () => setFilterValues({}),
    clearFiltersButtonText: "Clear all filters",
  };

  /**
   * Props for the FilterToolbar component (our component for rendering filters)
   */
  const filterToolbarProps: IFilterToolbarProps<TItem, TFilterCategoryKey> = {
    filterCategories,
    currentFilterCategoryKey,
    setCurrentFilterCategoryKey,
    categoryTitles,
  };

  return { toolbarProps, filterToolbarProps };
};

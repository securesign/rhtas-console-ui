import { getFilterLogicOperator } from "./helpers";
import type { FilterValue, IFilterCategory, IFilterValues } from "./types";

/**
 * Args for getLocalFilterDerivedState
 */
export interface ILocalFilterDerivedStateArgs<TItem, TFilterCategoryKey extends string> {
  /**
   * The data items before filtering
   */
  items: TItem[];

  /**
   * The "source of truth" state for the filter feature (returned by useFilterState)
   */
  filterValues: IFilterValues<TFilterCategoryKey>;

  /**
   * Definitions of the filters to be used
   */
  filterCategories?: IFilterCategory<TItem, TFilterCategoryKey>[];
}

/**
 * Given the "source of truth" state for the filter feature and additional arguments, returns "derived state" values and convenience functions.
 * - For local/client-computed tables only. Performs the actual filtering logic, which is done on the server for server-computed tables.
 */
export const getLocalFilterDerivedState = <TItem, TFilterCategoryKey extends string>({
  items,
  filterCategories = [],
  filterValues,
}: ILocalFilterDerivedStateArgs<TItem, TFilterCategoryKey>) => {
  const filteredItems = items.filter((item) =>
    Object.entries<FilterValue>(filterValues).every(([filterKey, values]) => {
      if (!values || values.length === 0) return true;
      const filterCategory = filterCategories.find((category) => category.categoryKey === filterKey);
      if (!filterCategory?.matcher) return true;
      const matcher = filterCategory.matcher;
      const logicOperator = getFilterLogicOperator(filterCategory) === "AND" ? "every" : "some";
      return values[logicOperator]((filterValue) => matcher(filterValue, item));
    })
  );

  return { filteredItems };
};

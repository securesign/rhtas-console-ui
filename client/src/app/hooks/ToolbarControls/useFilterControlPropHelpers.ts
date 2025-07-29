import type { IFilterControlProps } from "@app/components/FilterToolbar/FilterControl";

import type { FilterValue } from "../TableControls/filtering/types";
import type { IFilterState } from "../TableControls/filtering/useFilterState";

export interface IFilterControlPropHelpersExternalArgs<TFilterCategoryKey extends string> {
  filterState: IFilterState<TFilterCategoryKey>;
  categoryTitles: Record<TFilterCategoryKey, string>;
}

export const useFilterControlPropHelpers = <TFilterCategoryKey extends string>(
  args: IFilterControlPropHelpersExternalArgs<TFilterCategoryKey>
) => {
  const {
    filterState: { filterValues, setFilterValues },
    categoryTitles,
  } = args;

  const setFilterValue = (categoryKey: TFilterCategoryKey, newValue: FilterValue) =>
    setFilterValues({ ...filterValues, [categoryKey]: newValue });

  const getFilterControlProps = ({
    categoryKey,
  }: {
    categoryKey: TFilterCategoryKey;
  }): Omit<IFilterControlProps<TFilterCategoryKey>, "showToolbarItem" | "isDisabled"> => {
    return {
      categoryKey,
      categoryName: categoryTitles[categoryKey],
      filterValue: filterValues[categoryKey],
      setFilterValue: (newValue) => setFilterValue(categoryKey, newValue),
    };
  };

  return { getFilterControlProps };
};

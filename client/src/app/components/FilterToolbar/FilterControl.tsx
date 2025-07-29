import type { FilterValue } from "@app/hooks/TableControls/filtering/types";

export interface IFilterControlProps<TFilterCategoryKey extends string> {
  categoryKey: TFilterCategoryKey;
  categoryName: string;
  filterValue: FilterValue;
  setFilterValue: (newValue: FilterValue) => void;
  showToolbarItem?: boolean;
  isDisabled?: boolean;
}

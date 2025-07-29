import { useMemo } from "react";

import { getLocalFilterDerivedState } from "./filtering/getLocalFilterDerivedState";
import type { IFilterCategory, IFilterValues } from "./filtering/types";
import { getLocalPaginationDerivedState } from "./pagination/getLocalPaginationDerivedState";
import type { IActivePagination } from "./pagination/usePaginationState";
import { getLocalSortDerivedState } from "./sorting/getLocalSortDerivedState";
import type { IActiveSort } from "./sorting/useSortState";

export interface ILocalTableControlDerivedStateArgs<
  TItem,
  TFilterCategoryKey extends string,
  TSortableColumnKey extends string,
> {
  items: TItem[];
  filtering: {
    filterCategories?: IFilterCategory<TItem, TFilterCategoryKey>[];
    activeFilters: IFilterValues<TFilterCategoryKey>;
  };
  sorting: {
    getSortValues?: (item: TItem) => Record<TSortableColumnKey, string | number | boolean>;
    activeSort: IActiveSort<TSortableColumnKey> | null;
  };
  pagination: {
    activePage: IActivePagination;
  };
}

export const useLocalTableControlDerivedState = <
  TItem,
  TFilterCategoryKey extends string,
  TSortableColumnKey extends string,
>({
  items,
  filtering,
  sorting,
  pagination,
}: ILocalTableControlDerivedStateArgs<TItem, TFilterCategoryKey, TSortableColumnKey>) => {
  const { filteredItems } = useMemo(() => {
    return getLocalFilterDerivedState({
      items,
      filterCategories: filtering.filterCategories,
      filterValues: filtering.activeFilters,
    });
  }, [items, filtering]);

  const { sortedItems } = useMemo(() => {
    return getLocalSortDerivedState({
      items: filteredItems,
      ...sorting,
    });
  }, [filteredItems, sorting]);

  const { currentPageItems } = useMemo(() => {
    return getLocalPaginationDerivedState({
      items: sortedItems,
      activePage: pagination.activePage,
    });
  }, [sortedItems, pagination]);

  return {
    filteredItems,
    totalItemCount: filteredItems.length,
    currentPageItems: currentPageItems,
  };
};

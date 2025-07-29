import type { IFilterCategory } from "./filtering/types";
import { useFilterState, type IFilterStateArgs } from "./filtering/useFilterState";
import { usePaginationState, type IPaginationStateArgs } from "./pagination/usePaginationState";
import { useSortState, type ISortStateArgs } from "./sorting/useSortState";
import { useLocalTableControlDerivedState } from "./useLocalTableControlDerivedState";

export interface ITableArgs<TItem, TSortableColumnKey extends string, TFilterCategoryKey extends string> {
  items: TItem[];
  filtering?: IFilterStateArgs<TFilterCategoryKey> & {
    filterCategories?: IFilterCategory<TItem, TFilterCategoryKey>[];
  };
  sorting?: ISortStateArgs<TSortableColumnKey> & {
    getSortValues?: (item: TItem) => Record<TSortableColumnKey, string | number | boolean>;
  };
  pagination?: IPaginationStateArgs;
}

export const useTable = <TItem, TSortableColumnKey extends string, TFilterCategoryKey extends string>({
  items,
  filtering,
  sorting,
  pagination,
}: ITableArgs<TItem, TSortableColumnKey, TFilterCategoryKey>) => {
  const filteringState = useFilterState({
    initialFilterValues: filtering?.initialFilterValues,
  });

  const sortingState = useSortState({
    initialSort: sorting?.initialSort,
    sortableColumns: sorting?.sortableColumns ?? [],
  });

  const paginationState = usePaginationState(pagination);

  const tableState = useLocalTableControlDerivedState({
    items: items,
    filtering: {
      filterCategories: filtering?.filterCategories,
      activeFilters: filteringState.filterValues,
    },
    sorting: {
      getSortValues: sorting?.getSortValues,
      activeSort: sortingState.activeSort,
    },
    pagination: {
      activePage: {
        pageNumber: paginationState.pageNumber,
        itemsPerPage: paginationState.itemsPerPage,
      },
    },
  });

  return {
    filteringState,
    sortingState,
    paginationState,
    tableState,
  };
};

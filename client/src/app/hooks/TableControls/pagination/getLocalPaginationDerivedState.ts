import type { IActivePagination } from "./usePaginationState";

/**
 * Args for getLocalPaginationDerivedState
 */
export interface ILocalPaginationDerivedStateArgs<TItem> {
  /**
   * The data items before pagination (but after filtering)
   */
  items: TItem[];
  /**
   * The "source of truth" state for the pagination feature
   */
  activePage: IActivePagination;
}

/**
 * Given the "source of truth" state for the pagination feature and additional arguments, returns "derived state" values and convenience functions.
 * - For local/client-computed tables only. Performs the actual pagination logic, which is done on the server for server-computed tables.
 */
export const getLocalPaginationDerivedState = <TItem>({
  items,
  activePage: { pageNumber, itemsPerPage },
}: ILocalPaginationDerivedStateArgs<TItem>) => {
  const pageStartIndex = (pageNumber - 1) * itemsPerPage;
  const currentPageItems = items.slice(pageStartIndex, pageStartIndex + itemsPerPage);
  return { currentPageItems };
};

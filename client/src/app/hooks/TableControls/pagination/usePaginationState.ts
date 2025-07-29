import React from "react";

/**
 * The currently applied pagination parameters
 */
export interface IActivePagination {
  /**
   * The current page number on the user's pagination controls (counting from 1)
   */
  pageNumber: number;
  /**
   * The current "items per page" setting on the user's pagination controls (defaults to 10)
   */
  itemsPerPage: number;
}

/**
 * The "source of truth" state for the pagination feature.
 */
export interface IPaginationState extends IActivePagination {
  /**
   * Updates the current page number on the user's pagination controls (counting from 1)
   */
  setPageNumber: (pageNumber: number) => void;
  /**
   * Updates the "items per page" setting on the user's pagination controls (defaults to 10)
   */
  setItemsPerPage: (numItems: number) => void;
}

/**
 * Args for usePaginationState
 */
export interface IPaginationStateArgs {
  /**
   * The initial value of the "items per page" setting on the user's pagination controls (defaults to 10)
   */
  initialItemsPerPage?: number;
}

/**
 * Provides the "source of truth" state for the pagination feature.
 */
export const usePaginationState = (args?: IPaginationStateArgs): IPaginationState => {
  const initialItemsPerPage = args?.initialItemsPerPage ?? 10;

  const defaultValue: IActivePagination = {
    pageNumber: 1,
    itemsPerPage: initialItemsPerPage,
  };

  const [paginationState, setPaginationState] = React.useState<IActivePagination | null>(null);

  const { pageNumber, itemsPerPage } = paginationState ?? defaultValue;
  const setPageNumber = (num: number) =>
    setPaginationState({
      pageNumber: num >= 1 ? num : 1,
      itemsPerPage: paginationState?.itemsPerPage ?? initialItemsPerPage,
    });
  const setItemsPerPage = (itemsPerPage: number) =>
    setPaginationState({
      pageNumber: paginationState?.pageNumber ?? 1,
      itemsPerPage,
    });
  return { pageNumber, setPageNumber, itemsPerPage, setItemsPerPage };
};

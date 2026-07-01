import React, { useRef } from "react";

import type { IFilterValues } from "./types";

/**
 * The "source of truth" state for the filter feature.
 */
export interface IFilterState<TFilterCategoryKey extends string> {
  /**
   * A mapping:
   * - from string keys uniquely identifying a filterCategory (inferred from the `key` properties of elements in the `filterCategories` array)
   * - to arrays of strings representing the current value(s) of that filter. Single-value filters are stored as an array with one element.
   */
  filterValues: IFilterValues<TFilterCategoryKey>;
  /**
   * Updates the `filterValues` mapping.
   */
  setFilterValues: (values: IFilterValues<TFilterCategoryKey>) => void;
}

/**
 * Args for useFilterState
 */
export interface IFilterStateArgs<TFilterCategoryKey extends string> {
  initialFilterValues?: IFilterValues<TFilterCategoryKey>;
}

/**
 * Provides the "source of truth" state for the filter feature.
 */
export const useFilterState = <TFilterCategoryKey extends string>(
  args: IFilterStateArgs<TFilterCategoryKey>
): IFilterState<TFilterCategoryKey> => {
  const isInitialLoadRef = useRef(true);

  let initialFilterValues = {};

  if (isInitialLoadRef.current) {
    initialFilterValues = args?.initialFilterValues ?? {};
    isInitialLoadRef.current = false;
  }

  const [filterValues, setFilterValues] = React.useState<IFilterValues<TFilterCategoryKey>>(initialFilterValues);
  return { filterValues, setFilterValues };
};

import React, { useEffect, useState } from "react";

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
  // We need to know if it's the initial load to avoid overwriting changes to the filter values
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  let initialFilterValues = {};

  if (isInitialLoad) {
    initialFilterValues = args?.initialFilterValues ?? {};
  }

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  const [filterValues, setFilterValues] = React.useState<IFilterValues<TFilterCategoryKey>>(initialFilterValues);
  return { filterValues, setFilterValues };
};

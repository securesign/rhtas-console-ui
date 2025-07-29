import type { PaginationProps, ToolbarItemProps } from "@patternfly/react-core";

import { type IUsePaginationEffectsArgs, usePaginationEffects } from "./usePaginationEffects";
import type { IPaginationState } from "./usePaginationState";

/**
 * Args for usePaginationPropHelpers that come from outside useTableControlProps
 */
export type IPaginationPropHelpersExternalArgs = IUsePaginationEffectsArgs & {
  /**
   * The "source of truth" state for the pagination feature (returned by usePaginationState)
   */
  paginationState: IPaginationState;
  /**
    The total number of items in the entire un-filtered, un-paginated table (the size of the entire API collection being tabulated).
   */
  totalItemCount: number;
};

/**
 * Returns derived state and prop helpers for the pagination feature based on given "source of truth" state.
 */
export const usePaginationPropHelpers = (args: IPaginationPropHelpersExternalArgs) => {
  const {
    totalItemCount,
    paginationState: { itemsPerPage, pageNumber, setPageNumber, setItemsPerPage },
  } = args;

  usePaginationEffects(args);

  /**
   * Props for the PF Pagination component
   */
  const paginationProps: PaginationProps = {
    itemCount: totalItemCount,
    perPage: itemsPerPage,
    page: pageNumber,
    onSetPage: (_event, pageNumber) => setPageNumber(pageNumber),
    onPerPageSelect: (_event, perPage) => {
      setPageNumber(1);
      setItemsPerPage(perPage);
    },
  };

  /**
   * Props for the PF ToolbarItem component which contains the Pagination component
   */
  const paginationToolbarItemProps: ToolbarItemProps = {
    variant: "pagination",
    align: { default: "alignEnd" },
  };

  return { paginationProps, paginationToolbarItemProps };
};

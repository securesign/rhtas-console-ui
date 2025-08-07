import type { TdProps } from "@patternfly/react-table";

import type { KeyWithValueType } from "@app/utils/type-utils";
import { getExpansionDerivedState } from "./getExpansionDerivedState";
import type { IExpansionState } from "./useExpansionState";

/**
 * Args for useExpansionPropHelpers
 */
export interface IExpansionPropHelpersExternalArgs<TItem, TColumnKey extends string> {
  /**
   * The string key/name of a property on the API data item objects that can be used as a unique identifier (string or number)
   */
  idProperty: KeyWithValueType<TItem, string | number>;
  /**
   * The "source of truth" state for the expansion feature (returned by useExpansionState)
   */
  expansionState: IExpansionState<TColumnKey>;
}

/**
 * Additional args for useExpansionPropHelpers that come from logic inside useTableControlProps
 * @see useTableControlProps
 */
export interface IExpansionPropHelpersInternalArgs<TColumnKey extends string> {
  /**
   * The keys of the `columnNames` object (unique keys identifying each column).
   */
  columnKeys: TColumnKey[];
}

/**
 * Returns derived state and prop helpers for the expansion feature based on given "source of truth" state.
 * - Used internally by useTableControlProps
 * - "Derived state" here refers to values and convenience functions derived at render time.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 */
export const useExpansionPropHelpers = <TItem, TColumnKey extends string>(
  args: IExpansionPropHelpersExternalArgs<TItem, TColumnKey> & IExpansionPropHelpersInternalArgs<TColumnKey>
) => {
  const { idProperty, columnKeys } = args;

  const expansionDerivedState = getExpansionDerivedState(args);
  const { isCellExpanded, setCellExpanded } = expansionDerivedState;

  /**
   * Returns props for the Td to the left of the data cells which contains each row's expansion toggle button (only for single-expand).
   */
  const getSingleExpandButtonTdProps = ({
    item,
    rowIndex,
  }: {
    item: TItem;
    rowIndex: number;
  }): Omit<TdProps, "ref"> => ({
    expand: {
      rowIndex,
      isExpanded: isCellExpanded(item),
      onToggle: () =>
        setCellExpanded({
          item,
          isExpanding: !isCellExpanded(item),
        }),
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      expandId: `expandable-row-${item[idProperty]}`,
    },
  });

  /**
   * Returns props for the Td which is a data cell in an expandable column and functions as an expand toggle (only for compound-expand)
   */
  const getCompoundExpandTdProps = ({
    columnKey,
    item,
    rowIndex,
  }: {
    columnKey: TColumnKey;
    item: TItem;
    rowIndex: number;
  }): Omit<TdProps, "ref"> => ({
    compoundExpand: {
      isExpanded: isCellExpanded(item, columnKey),
      onToggle: () =>
        setCellExpanded({
          item,
          isExpanding: !isCellExpanded(item, columnKey),
          columnKey,
        }),
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      expandId: `compound-expand-${item[idProperty]}-${columnKey}`,
      rowIndex,
      columnIndex: columnKeys.indexOf(columnKey),
    },
  });

  return {
    expansionDerivedState,
    getSingleExpandButtonTdProps,
    getCompoundExpandTdProps,
  };
};

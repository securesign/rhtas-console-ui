import React from "react";

/**
 * A map of item ids (strings resolved from `item[idProperty]`) to either:
 * - a `columnKey` if that item's row has a compound-expanded cell
 * - or a boolean:
 *   - true if the row is expanded (for single-expand)
 *   - false if the row and all its cells are collapsed (for both single-expand and compound-expand).
 */
export type TExpandedCells<TColumnKey extends string> = Record<string, TColumnKey | boolean>;

/**
 * The "source of truth" state for the expansion feature.
 */
export interface IExpansionState<TColumnKey extends string> {
  /**
   * A map of item ids to a `columnKey` or boolean for the current expansion state of that cell/row
   * @see TExpandedCells
   */
  expandedCells: TExpandedCells<TColumnKey>;
  /**
   * Updates the `expandedCells` map (replacing the entire map).
   * - See `expansionDerivedState` for helper functions to expand/collapse individual cells/rows.
   * @see IExpansionDerivedState
   */
  setExpandedCells: (newExpandedCells: TExpandedCells<TColumnKey>) => void;
}

/**
 * Args for useExpansionState
 */
export interface IExpansionStateArgs {
  /**
   * Whether to use single-expand or compound-expand behavior
   * - "single" for the entire row to be expandable with one toggle.
   * - "compound" for multiple cells in a row to be expandable with individual toggles.
   */
  expandableVariant: "single" | "compound";
}

/**
 * Provides the "source of truth" state for the expansion feature.
 * - Used internally by useTableControlState
 * - Takes args defined above as well as optional args for persisting state to a configurable storage target.
 */
export const useExpansionState = <TColumnKey extends string>(): IExpansionState<TColumnKey> => {
  const [expandedCells, setExpandedCells] = React.useState<TExpandedCells<TColumnKey>>({});
  return { expandedCells, setExpandedCells };
};

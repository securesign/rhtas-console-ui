import type { IFilterCategory } from "./types";

export const getFilterLogicOperator = <TItem, TFilterCategoryKey extends string>(
  filterCategory?: IFilterCategory<TItem, TFilterCategoryKey>,
  defaultOperator: "AND" | "OR" = "OR"
) => filterCategory?.logicOperator ?? defaultOperator;

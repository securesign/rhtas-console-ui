export type FilterValue = string[] | undefined | null;

export type IFilterValues<TFilterCategoryKey extends string> = Partial<Record<TFilterCategoryKey, FilterValue>>;

export interface IFilterCategory<
  /** The actual API objects we're filtering */
  TItem,
  TFilterCategoryKey extends string, // Unique identifiers for each filter category (inferred from key properties if possible)
> {
  /** For use in the filterValues state object. Must be unique per category. */
  categoryKey: TFilterCategoryKey;

  /** For client side filtering, provide custom algorithm for testing if the value of `TItem` matches the filter value. */
  matcher?: (filter: string, item: TItem) => boolean;

  /** How to connect multiple selected options together. Defaults to "AND". */
  logicOperator?: "AND" | "OR";
}

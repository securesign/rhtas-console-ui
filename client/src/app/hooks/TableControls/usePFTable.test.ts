import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePFTable } from "./usePFTable";
import type { IFilterCategory } from "./filtering/types";

interface TestItem {
  id: string;
  name: string;
  status: string;
  category: string;
}

describe("usePFTable", () => {
  const mockItems: TestItem[] = [
    { id: "1", name: "Item 1", status: "active", category: "A" },
    { id: "2", name: "Item 2", status: "pending", category: "B" },
    { id: "3", name: "Item 3", status: "active", category: "A" },
    { id: "4", name: "Item 4", status: "inactive", category: "C" },
    { id: "5", name: "Item 5", status: "active", category: "B" },
  ];

  it("should initialize with all table state and prop helpers", () => {
    const { result } = renderHook(() =>
      usePFTable<TestItem, "name" | "status", "name", "category">({
        items: mockItems,
        columns: ["name", "status"],
        idProperty: "id",
      })
    );

    // Check table state
    expect(result.current.filteringState).toBeDefined();
    expect(result.current.sortingState).toBeDefined();
    expect(result.current.paginationState).toBeDefined();
    expect(result.current.tableState).toBeDefined();

    // Check prop helpers
    expect(result.current.propHelpers).toBeDefined();
    expect(result.current.propHelpers.getSortThProps).toBeDefined();
    expect(result.current.propHelpers.paginationProps).toBeDefined();
    expect(result.current.propHelpers.paginationToolbarItemProps).toBeDefined();
    expect(result.current.propHelpers.getSingleExpandButtonTdProps).toBeDefined();
    expect(result.current.propHelpers.getCompoundExpandTdProps).toBeDefined();

    // Check expansion derived state
    expect(result.current.expansionDerivedState).toBeDefined();
    expect(result.current.expansionDerivedState.isCellExpanded).toBeDefined();
    expect(result.current.expansionDerivedState.setCellExpanded).toBeDefined();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() =>
      usePFTable<TestItem, "name" | "status", "name", "category">({
        items: mockItems,
        columns: ["name", "status"],
        idProperty: "id",
      })
    );

    expect(result.current.filteringState.filterValues).toEqual({});
    expect(result.current.sortingState.activeSort).toBeNull();
    expect(result.current.paginationState.pageNumber).toBe(1);
    expect(result.current.paginationState.itemsPerPage).toBe(10);
    expect(result.current.tableState.totalItemCount).toBe(5);
    expect(result.current.tableState.currentPageItems).toHaveLength(5);
  });

  it("should support filtering", () => {
    const filterCategories: IFilterCategory<TestItem, "category">[] = [
      {
        categoryKey: "category",
        matcher: (filter, item) => item.category === filter,
      },
    ];

    const { result } = renderHook(() =>
      usePFTable<TestItem, "name" | "status", "name", "category">({
        items: mockItems,
        columns: ["name", "status"],
        idProperty: "id",
        filtering: {
          filterCategories,
        },
      })
    );

    act(() => {
      result.current.filteringState.setFilterValues({
        category: ["A"],
      });
    });

    expect(result.current.tableState.totalItemCount).toBe(2);
    expect(result.current.tableState.currentPageItems).toHaveLength(2);
  });

  it("should support sorting", () => {
    const { result } = renderHook(() =>
      usePFTable<TestItem, "name" | "status", "name", "category">({
        items: mockItems,
        columns: ["name", "status"],
        idProperty: "id",
        sorting: {
          sortableColumns: ["name"],
          getSortValues: (item) => ({
            name: item.name,
          }),
        },
      })
    );

    act(() => {
      result.current.sortingState.setActiveSort({
        columnKey: "name",
        direction: "asc",
      });
    });

    const sortedNames = result.current.tableState.currentPageItems.map((item) => item.name);
    expect(sortedNames).toEqual(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]);
  });

  it("should support pagination", () => {
    const { result } = renderHook(() =>
      usePFTable<TestItem, "name" | "status", "name", "category">({
        items: mockItems,
        columns: ["name", "status"],
        idProperty: "id",
        pagination: {
          initialItemsPerPage: 2,
        },
      })
    );

    expect(result.current.tableState.currentPageItems).toHaveLength(2);
    expect(result.current.paginationState.pageNumber).toBe(1);

    act(() => {
      result.current.paginationState.setPageNumber(2);
    });

    expect(result.current.paginationState.pageNumber).toBe(2);
    expect(result.current.tableState.currentPageItems).toHaveLength(2);
  });

  it("should provide getSortThProps that works correctly", () => {
    const { result } = renderHook(() =>
      usePFTable<TestItem, "name" | "status", "name", "category">({
        items: mockItems,
        columns: ["name", "status"],
        idProperty: "id",
        sorting: {
          sortableColumns: ["name"],
          getSortValues: (item) => ({
            name: item.name,
          }),
        },
      })
    );

    const sortProps = result.current.propHelpers.getSortThProps({ columnKey: "name" });
    expect(sortProps.sort).toBeDefined();
    expect(sortProps.sort?.columnIndex).toBe(0);

    act(() => {
      result.current.sortingState.setActiveSort({
        columnKey: "name",
        direction: "asc",
      });
    });

    const updatedSortProps = result.current.propHelpers.getSortThProps({ columnKey: "name" });
    expect(updatedSortProps.sort?.sortBy?.direction).toBe("asc");
  });

  it("should provide paginationProps that work correctly", () => {
    // Create enough items to have multiple pages
    const manyItems: TestItem[] = Array.from({ length: 25 }, (_, i) => ({
      id: String(i + 1),
      name: `Item ${i + 1}`,
      status: "active",
      category: "A",
    }));

    const { result } = renderHook(() =>
      usePFTable<TestItem, "name" | "status", "name", "category">({
        items: manyItems,
        columns: ["name", "status"],
        idProperty: "id",
        pagination: {
          initialItemsPerPage: 10,
        },
      })
    );

    expect(result.current.propHelpers.paginationProps.itemCount).toBe(25);
    expect(result.current.propHelpers.paginationProps.perPage).toBe(10);
    expect(result.current.propHelpers.paginationProps.page).toBe(1);
    expect(result.current.paginationState.pageNumber).toBe(1);

    act(() => {
      result.current.propHelpers.paginationProps.onSetPage?.(null as never, 2);
    });

    // State should be updated
    expect(result.current.paginationState.pageNumber).toBe(2);
    // Props should reflect the updated state
    expect(result.current.propHelpers.paginationProps.page).toBe(2);
  });

  it("should provide getSingleExpandButtonTdProps that work correctly", () => {
    const { result } = renderHook(() =>
      usePFTable<TestItem, "name" | "status", "name", "category">({
        items: mockItems,
        columns: ["name", "status"],
        idProperty: "id",
      })
    );

    const item = mockItems[0];
    const props = result.current.propHelpers.getSingleExpandButtonTdProps({
      item,
      rowIndex: 0,
    });

    expect(props.expand).toBeDefined();
    expect(props.expand?.isExpanded).toBe(false);
    expect(props.expand?.expandId).toBe("expandable-row-1");

    act(() => {
      if (props.expand?.onToggle) {
        (props.expand.onToggle as () => void)();
      }
    });

    const updatedProps = result.current.propHelpers.getSingleExpandButtonTdProps({
      item,
      rowIndex: 0,
    });
    expect(updatedProps.expand?.isExpanded).toBe(true);
  });

  it("should provide getCompoundExpandTdProps that work correctly", () => {
    const { result } = renderHook(() =>
      usePFTable<TestItem, "name" | "status", "name", "category">({
        items: mockItems,
        columns: ["name", "status"],
        idProperty: "id",
      })
    );

    const item = mockItems[0];
    const props = result.current.propHelpers.getCompoundExpandTdProps({
      columnKey: "name",
      item,
      rowIndex: 0,
    });

    expect(props.compoundExpand).toBeDefined();
    expect(props.compoundExpand?.isExpanded).toBe(false);
    expect(props.compoundExpand?.expandId).toBe("compound-expand-1-name");
    expect(props.compoundExpand?.columnIndex).toBe(0);

    act(() => {
      if (props.compoundExpand?.onToggle) {
        (props.compoundExpand.onToggle as () => void)();
      }
    });

    const updatedProps = result.current.propHelpers.getCompoundExpandTdProps({
      columnKey: "name",
      item,
      rowIndex: 0,
    });
    expect(updatedProps.compoundExpand?.isExpanded).toBe(true);
  });

  it("should provide expansionDerivedState that works correctly", () => {
    const { result } = renderHook(() =>
      usePFTable<TestItem, "name" | "status", "name", "category">({
        items: mockItems,
        columns: ["name", "status"],
        idProperty: "id",
      })
    );

    const item = mockItems[0];

    expect(result.current.expansionDerivedState.isCellExpanded(item)).toBe(false);

    act(() => {
      result.current.expansionDerivedState.setCellExpanded({
        item,
        isExpanding: true,
      });
    });

    expect(result.current.expansionDerivedState.isCellExpanded(item)).toBe(true);

    act(() => {
      result.current.expansionDerivedState.setCellExpanded({
        item,
        isExpanding: false,
      });
    });

    expect(result.current.expansionDerivedState.isCellExpanded(item)).toBe(false);
  });

  it("should support compound expansion with columnKey", () => {
    const { result } = renderHook(() =>
      usePFTable<TestItem, "name" | "status", "name", "category">({
        items: mockItems,
        columns: ["name", "status"],
        idProperty: "id",
      })
    );

    const item = mockItems[0];

    expect(result.current.expansionDerivedState.isCellExpanded(item, "name")).toBe(false);

    act(() => {
      result.current.expansionDerivedState.setCellExpanded({
        item,
        isExpanding: true,
        columnKey: "name",
      });
    });

    expect(result.current.expansionDerivedState.isCellExpanded(item, "name")).toBe(true);
    expect(result.current.expansionDerivedState.isCellExpanded(item, "status")).toBe(false);
  });

  it("should combine filtering, sorting, and pagination correctly", () => {
    const filterCategories: IFilterCategory<TestItem, "category">[] = [
      {
        categoryKey: "category",
        matcher: (filter, item) => item.category === filter,
      },
    ];

    const { result } = renderHook(() =>
      usePFTable<TestItem, "name" | "status", "name", "category">({
        items: mockItems,
        columns: ["name", "status"],
        idProperty: "id",
        filtering: {
          filterCategories,
        },
        sorting: {
          sortableColumns: ["name"],
          getSortValues: (item) => ({
            name: item.name,
          }),
        },
        pagination: {
          initialItemsPerPage: 1,
        },
      })
    );

    // Filter by category A
    act(() => {
      result.current.filteringState.setFilterValues({
        category: ["A"],
      });
    });

    expect(result.current.tableState.totalItemCount).toBe(2);

    // Sort by name descending
    act(() => {
      result.current.sortingState.setActiveSort({
        columnKey: "name",
        direction: "desc",
      });
    });

    // First page should be Item 3 (sorted desc)
    expect(result.current.tableState.currentPageItems[0].name).toBe("Item 3");

    // Change to page 2
    act(() => {
      result.current.paginationState.setPageNumber(2);
    });

    // Second page should be Item 1
    expect(result.current.tableState.currentPageItems[0].name).toBe("Item 1");
  });

  it("should handle empty items array", () => {
    const { result } = renderHook(() =>
      usePFTable<TestItem, "name" | "status", "name", "category">({
        items: [],
        columns: ["name", "status"],
        idProperty: "id",
      })
    );

    expect(result.current.tableState.currentPageItems).toHaveLength(0);
    expect(result.current.tableState.totalItemCount).toBe(0);
  });

  it("should handle numeric IDs", () => {
    interface NumericItem {
      id: number;
      name: string;
    }

    const numericItems: NumericItem[] = [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
    ];

    const { result } = renderHook(() =>
      usePFTable<NumericItem, "name", "name", never>({
        items: numericItems,
        columns: ["name"],
        idProperty: "id",
      })
    );

    const item = numericItems[0];
    const props = result.current.propHelpers.getSingleExpandButtonTdProps({
      item,
      rowIndex: 0,
    });

    expect(props.expand?.expandId).toBe("expandable-row-1");
  });

  it("should provide paginationToolbarItemProps", () => {
    const { result } = renderHook(() =>
      usePFTable<TestItem, "name" | "status", "name", "category">({
        items: mockItems,
        columns: ["name", "status"],
        idProperty: "id",
      })
    );

    const toolbarProps = result.current.propHelpers.paginationToolbarItemProps;
    expect(toolbarProps.variant).toBe("pagination");
    expect(toolbarProps.align?.default).toBe("alignEnd");
  });
});

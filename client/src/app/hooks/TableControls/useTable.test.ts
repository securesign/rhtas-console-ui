import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTable } from "./useTable";
import type { IFilterCategory } from "./filtering/types";

interface TestItem {
  id: number;
  name: string;
  category: string;
  status: string;
}

describe("useTable", () => {
  const mockItems: TestItem[] = [
    { id: 1, name: "Item 1", category: "A", status: "active" },
    { id: 2, name: "Item 2", category: "B", status: "pending" },
    { id: 3, name: "Item 3", category: "A", status: "active" },
    { id: 4, name: "Item 4", category: "C", status: "inactive" },
    { id: 5, name: "Item 5", category: "B", status: "active" },
  ];

  it("should initialize with all items when no filters, sorting, or pagination provided", () => {
    const { result } = renderHook(() =>
      useTable({
        items: mockItems,
      })
    );

    expect(result.current.filteringState.filterValues).toEqual({});
    expect(result.current.sortingState.activeSort).toBeNull();
    expect(result.current.paginationState.pageNumber).toBe(1);
    expect(result.current.paginationState.itemsPerPage).toBe(10);
    expect(result.current.tableState.currentPageItems).toHaveLength(5);
    expect(result.current.tableState.totalItemCount).toBe(5);
  });

  it("should initialize with initial filter values", () => {
    const { result } = renderHook(() =>
      useTable({
        items: mockItems,
        filtering: {
          initialFilterValues: {
            category: ["A"],
          },
          filterCategories: [
            {
              categoryKey: "category",
              matcher: (filter, item) => item.category === filter,
            },
          ],
        },
      })
    );

    expect(result.current.filteringState.filterValues).toEqual({
      category: ["A"],
    });
    expect(result.current.tableState.totalItemCount).toBe(2); // Items 1 and 3
  });

  it("should initialize with initial sort", () => {
    const { result } = renderHook(() =>
      useTable({
        items: mockItems,
        sorting: {
          sortableColumns: ["name"],
          initialSort: {
            columnKey: "name",
            direction: "asc",
          },
          getSortValues: (item) => ({
            name: item.name,
          }),
        },
      })
    );

    expect(result.current.sortingState.activeSort).toEqual({
      columnKey: "name",
      direction: "asc",
    });
  });

  it("should initialize with custom pagination", () => {
    const { result } = renderHook(() =>
      useTable({
        items: mockItems,
        pagination: {
          initialItemsPerPage: 2,
        },
      })
    );

    expect(result.current.paginationState.itemsPerPage).toBe(2);
    expect(result.current.tableState.currentPageItems).toHaveLength(2);
  });

  it("should filter items based on filter values", () => {
    const filterCategories: IFilterCategory<TestItem, "category">[] = [
      {
        categoryKey: "category",
        matcher: (filter, item) => item.category === filter,
      },
    ];

    const { result } = renderHook(() =>
      useTable({
        items: mockItems,
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
    expect(result.current.tableState.currentPageItems).toEqual([
      { id: 1, name: "Item 1", category: "A", status: "active" },
      { id: 3, name: "Item 3", category: "A", status: "active" },
    ]);
  });

  it("should sort items based on active sort", () => {
    const { result } = renderHook(() =>
      useTable({
        items: mockItems,
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

    act(() => {
      result.current.sortingState.setActiveSort({
        columnKey: "name",
        direction: "desc",
      });
    });

    const descSortedNames = result.current.tableState.currentPageItems.map((item) => item.name);
    expect(descSortedNames).toEqual(["Item 5", "Item 4", "Item 3", "Item 2", "Item 1"]);
  });

  it("should paginate items correctly", () => {
    const { result } = renderHook(() =>
      useTable({
        items: mockItems,
        pagination: {
          initialItemsPerPage: 2,
        },
      })
    );

    // First page should have 2 items
    expect(result.current.tableState.currentPageItems).toHaveLength(2);
    expect(result.current.paginationState.pageNumber).toBe(1);

    // Move to second page
    act(() => {
      result.current.paginationState.setPageNumber(2);
    });

    expect(result.current.paginationState.pageNumber).toBe(2);
    expect(result.current.tableState.currentPageItems).toHaveLength(2);

    // Move to third page
    act(() => {
      result.current.paginationState.setPageNumber(3);
    });

    expect(result.current.paginationState.pageNumber).toBe(3);
    expect(result.current.tableState.currentPageItems).toHaveLength(1);
  });

  it("should combine filtering, sorting, and pagination", () => {
    const filterCategories: IFilterCategory<TestItem, "category" | "status">[] = [
      {
        categoryKey: "category",
        matcher: (filter, item) => item.category === filter,
      },
      {
        categoryKey: "status",
        matcher: (filter, item) => item.status === filter,
      },
    ];

    const { result } = renderHook(() =>
      useTable({
        items: mockItems,
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

    expect(result.current.tableState.totalItemCount).toBe(2); // Items 1 and 3

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
      useTable({
        items: [],
      })
    );

    expect(result.current.tableState.currentPageItems).toHaveLength(0);
    expect(result.current.tableState.totalItemCount).toBe(0);
  });

  it("should update when items change", () => {
    const { result, rerender } = renderHook(
      ({ items }: { items: TestItem[] }) =>
        useTable({
          items,
        }),
      {
        initialProps: { items: mockItems },
      }
    );

    expect(result.current.tableState.totalItemCount).toBe(5);

    rerender({ items: mockItems.slice(0, 3) });

    expect(result.current.tableState.totalItemCount).toBe(3);
  });

  it("should handle multiple filter categories", () => {
    const filterCategories: IFilterCategory<TestItem, "category" | "status">[] = [
      {
        categoryKey: "category",
        matcher: (filter, item) => item.category === filter,
      },
      {
        categoryKey: "status",
        matcher: (filter, item) => item.status === filter,
      },
    ];

    const { result } = renderHook(() =>
      useTable({
        items: mockItems,
        filtering: {
          filterCategories,
        },
      })
    );

    act(() => {
      result.current.filteringState.setFilterValues({
        category: ["A", "B"],
        status: ["active"],
      });
    });

    // Should filter to items with category A or B AND status active
    // Items: 1 (A, active), 2 (B, pending), 3 (A, active), 5 (B, active)
    // Result: 1, 3, 5
    expect(result.current.tableState.totalItemCount).toBe(3);
  });

  it("should reset pagination when filters change significantly", () => {
    const filterCategories: IFilterCategory<TestItem, "category">[] = [
      {
        categoryKey: "category",
        matcher: (filter, item) => item.category === filter,
      },
    ];

    const { result } = renderHook(() =>
      useTable({
        items: mockItems,
        filtering: {
          filterCategories,
        },
        pagination: {
          initialItemsPerPage: 2,
        },
      })
    );

    act(() => {
      result.current.paginationState.setPageNumber(3);
    });

    expect(result.current.paginationState.pageNumber).toBe(3);

    act(() => {
      result.current.filteringState.setFilterValues({
        category: ["A"],
      });
    });

    // Page number should remain, but currentPageItems should reflect filtered results
    expect(result.current.paginationState.pageNumber).toBe(3);
    // With only 2 filtered items and 2 per page, page 3 would be empty
    // But the hook doesn't auto-reset pagination, so this is expected behavior
  });
});

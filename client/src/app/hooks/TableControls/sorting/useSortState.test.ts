import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSortState } from "./useSortState";
import type { IActiveSort } from "./useSortState";

describe("useSortState", () => {
  it("should initialize with null activeSort when no initial sort provided", () => {
    const { result } = renderHook(() =>
      useSortState({
        sortableColumns: ["name", "date"],
      })
    );

    expect(result.current.activeSort).toBeNull();
  });

  it("should initialize with provided initial sort", () => {
    const initialSort: IActiveSort<"name" | "date"> = {
      columnKey: "name",
      direction: "asc",
    };

    const { result } = renderHook(() =>
      useSortState({
        sortableColumns: ["name", "date"],
        initialSort,
      })
    );

    expect(result.current.activeSort).toEqual(initialSort);
  });

  it("should update activeSort when setActiveSort is called", () => {
    const { result } = renderHook(() =>
      useSortState({
        sortableColumns: ["name", "date"],
      })
    );

    const newSort: IActiveSort<"name" | "date"> = {
      columnKey: "name",
      direction: "desc",
    };

    act(() => {
      result.current.setActiveSort(newSort);
    });

    expect(result.current.activeSort).toEqual(newSort);
  });

  it("should handle ascending sort direction", () => {
    const { result } = renderHook(() =>
      useSortState({
        sortableColumns: ["name"],
      })
    );

    act(() => {
      result.current.setActiveSort({
        columnKey: "name",
        direction: "asc",
      });
    });

    expect(result.current.activeSort?.direction).toBe("asc");
  });

  it("should handle descending sort direction", () => {
    const { result } = renderHook(() =>
      useSortState({
        sortableColumns: ["name"],
      })
    );

    act(() => {
      result.current.setActiveSort({
        columnKey: "name",
        direction: "desc",
      });
    });

    expect(result.current.activeSort?.direction).toBe("desc");
  });

  it("should handle multiple sortable columns", () => {
    const { result } = renderHook(() =>
      useSortState({
        sortableColumns: ["name", "date", "status"],
      })
    );

    act(() => {
      result.current.setActiveSort({
        columnKey: "date",
        direction: "asc",
      });
    });

    expect(result.current.activeSort?.columnKey).toBe("date");

    act(() => {
      result.current.setActiveSort({
        columnKey: "status",
        direction: "desc",
      });
    });

    expect(result.current.activeSort?.columnKey).toBe("status");
    expect(result.current.activeSort?.direction).toBe("desc");
  });

  it("should allow changing sort direction for same column", () => {
    const { result } = renderHook(() =>
      useSortState({
        sortableColumns: ["name"],
      })
    );

    act(() => {
      result.current.setActiveSort({
        columnKey: "name",
        direction: "asc",
      });
    });

    expect(result.current.activeSort?.direction).toBe("asc");

    act(() => {
      result.current.setActiveSort({
        columnKey: "name",
        direction: "desc",
      });
    });

    expect(result.current.activeSort?.direction).toBe("desc");
    expect(result.current.activeSort?.columnKey).toBe("name");
  });

  it("should maintain state across rerenders", () => {
    const { result, rerender } = renderHook(() =>
      useSortState({
        sortableColumns: ["name", "date"],
      })
    );

    act(() => {
      result.current.setActiveSort({
        columnKey: "name",
        direction: "asc",
      });
    });

    const activeSortBeforeRerender = result.current.activeSort;

    rerender();

    expect(result.current.activeSort).toBe(activeSortBeforeRerender);
    expect(result.current.activeSort).toEqual({
      columnKey: "name",
      direction: "asc",
    });
  });

  it("should handle initialSort as null explicitly", () => {
    const { result } = renderHook(() =>
      useSortState({
        sortableColumns: ["name"],
        initialSort: null,
      })
    );

    expect(result.current.activeSort).toBeNull();
  });

  it("should allow setting sort after initial null sort", () => {
    const { result } = renderHook(() =>
      useSortState({
        sortableColumns: ["name"],
        initialSort: null,
      })
    );

    expect(result.current.activeSort).toBeNull();

    act(() => {
      result.current.setActiveSort({
        columnKey: "name",
        direction: "asc",
      });
    });

    expect(result.current.activeSort).toEqual({
      columnKey: "name",
      direction: "asc",
    });
  });

  it("should handle empty sortableColumns array", () => {
    const { result } = renderHook(() =>
      useSortState({
        sortableColumns: [],
      })
    );

    expect(result.current.activeSort).toBeNull();

    // Even with empty sortableColumns, we can still set a sort
    // (though it may not be used in practice)
    act(() => {
      result.current.setActiveSort({
        columnKey: "name" as never,
        direction: "asc",
      });
    });

    expect(result.current.activeSort).not.toBeNull();
  });

  it("should handle changing from one column to another", () => {
    const { result } = renderHook(() =>
      useSortState({
        sortableColumns: ["name", "date", "status"],
      })
    );

    act(() => {
      result.current.setActiveSort({
        columnKey: "name",
        direction: "asc",
      });
    });

    expect(result.current.activeSort?.columnKey).toBe("name");

    act(() => {
      result.current.setActiveSort({
        columnKey: "date",
        direction: "desc",
      });
    });

    expect(result.current.activeSort?.columnKey).toBe("date");
    expect(result.current.activeSort?.direction).toBe("desc");
  });
});

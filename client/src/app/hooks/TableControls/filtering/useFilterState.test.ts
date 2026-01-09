import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFilterState } from "./useFilterState";
import type { IFilterValues } from "./types";

describe("useFilterState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize with empty filter values when no initial values provided", () => {
    const { result } = renderHook(() => useFilterState({}));

    expect(result.current.filterValues).toEqual({});
  });

  it("should initialize with provided initial filter values", () => {
    const initialValues: IFilterValues<"category" | "status"> = {
      category: ["A", "B"],
      status: ["active"],
    };

    const { result } = renderHook(() =>
      useFilterState({
        initialFilterValues: initialValues,
      })
    );

    expect(result.current.filterValues).toEqual(initialValues);
  });

  it("should update filter values when setFilterValues is called", () => {
    const { result } = renderHook(() => useFilterState({}));

    act(() => {
      result.current.setFilterValues({
        category: ["A"],
      });
    });

    expect(result.current.filterValues).toEqual({
      category: ["A"],
    });
  });

  it("should replace filter values completely when setFilterValues is called", () => {
    const initialValues: IFilterValues<"category" | "status"> = {
      category: ["A"],
      status: ["active"],
    };

    const { result } = renderHook(() =>
      useFilterState({
        initialFilterValues: initialValues,
      })
    );

    act(() => {
      result.current.setFilterValues({
        category: ["B", "C"],
      });
    });

    expect(result.current.filterValues).toEqual({
      category: ["B", "C"],
    });
    // status should be removed
    expect(result.current.filterValues.status).toBeUndefined();
  });

  it("should handle multiple filter categories", () => {
    const { result } = renderHook(() => useFilterState({}));

    act(() => {
      result.current.setFilterValues({
        category: ["A", "B"],
        status: ["active", "pending"],
        type: ["feature"],
      });
    });

    expect(result.current.filterValues).toEqual({
      category: ["A", "B"],
      status: ["active", "pending"],
      type: ["feature"],
    });
  });

  it("should handle single-value filters as arrays", () => {
    const { result } = renderHook(() => useFilterState({}));

    act(() => {
      result.current.setFilterValues({
        category: ["single-value"],
      });
    });

    expect(result.current.filterValues.category).toEqual(["single-value"]);
  });

  it("should not overwrite initial values after initial render", () => {
    const initialValues: IFilterValues<"category"> = {
      category: ["initial"],
    };

    const { result, rerender } = renderHook(
      ({ initialFilterValues }: { initialFilterValues?: IFilterValues<"category"> }) =>
        useFilterState({ initialFilterValues }),
      {
        initialProps: { initialFilterValues: initialValues },
      }
    );

    // Change filter values
    act(() => {
      result.current.setFilterValues({
        category: ["changed"],
      });
    });

    expect(result.current.filterValues.category).toEqual(["changed"]);

    // Rerender with same initial values - should not overwrite
    rerender({ initialFilterValues: initialValues });

    // Filter values should remain changed
    expect(result.current.filterValues.category).toEqual(["changed"]);
  });

  it("should handle empty filter arrays", () => {
    const { result } = renderHook(() => useFilterState({}));

    act(() => {
      result.current.setFilterValues({
        category: [],
      });
    });

    expect(result.current.filterValues.category).toEqual([]);
  });

  it("should handle clearing all filters", () => {
    const initialValues: IFilterValues<"category" | "status"> = {
      category: ["A"],
      status: ["active"],
    };

    const { result } = renderHook(() =>
      useFilterState({
        initialFilterValues: initialValues,
      })
    );

    act(() => {
      result.current.setFilterValues({});
    });

    expect(result.current.filterValues).toEqual({});
  });

  it("should maintain filter values across rerenders", () => {
    const { result, rerender } = renderHook(() => useFilterState({}));

    act(() => {
      result.current.setFilterValues({
        category: ["A"],
      });
    });

    const filterValuesBeforeRerender = result.current.filterValues;

    rerender();

    expect(result.current.filterValues).toBe(filterValuesBeforeRerender);
    expect(result.current.filterValues).toEqual({
      category: ["A"],
    });
  });
});

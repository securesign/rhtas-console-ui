import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useWithUiId } from "./query-utils";

describe("useWithUiId", () => {
  it("should add UI unique ID to each item in the array", () => {
    const data = [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
      { id: 3, name: "Item 3" },
    ];

    const { result } = renderHook(() => useWithUiId(data, (item, index) => `id-${item.id}-${index}`));

    expect(result.current).toHaveLength(3);
    expect(result.current[0]).toEqual({
      id: 1,
      name: "Item 1",
      _ui_unique_id: "id-1-0",
    });
    expect(result.current[1]).toEqual({
      id: 2,
      name: "Item 2",
      _ui_unique_id: "id-2-1",
    });
    expect(result.current[2]).toEqual({
      id: 3,
      name: "Item 3",
      _ui_unique_id: "id-3-2",
    });
  });

  it("should return empty array when data is undefined", () => {
    const { result } = renderHook(() => useWithUiId(undefined, () => "id"));

    expect(result.current).toEqual([]);
  });

  it("should return empty array when data is empty", () => {
    const { result } = renderHook(() => useWithUiId([], () => "id"));

    expect(result.current).toEqual([]);
  });

  it("should preserve all original properties", () => {
    const data = [
      { id: 1, name: "Item 1", extra: "value1", nested: { prop: "test" } },
      { id: 2, name: "Item 2", extra: "value2", nested: { prop: "test2" } },
    ];

    const { result } = renderHook(() => useWithUiId(data, (_item, index) => `id-${index}`));

    expect(result.current[0]).toEqual({
      id: 1,
      name: "Item 1",
      extra: "value1",
      nested: { prop: "test" },
      _ui_unique_id: "id-0",
    });
    expect(result.current[1]).toEqual({
      id: 2,
      name: "Item 2",
      extra: "value2",
      nested: { prop: "test2" },
      _ui_unique_id: "id-1",
    });
  });

  it("should use generator function with correct parameters", () => {
    const data = [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
    ];

    const generator = vi.fn((item, index) => `generated-${item.id}-${index}`);

    const { result } = renderHook(() => useWithUiId(data, generator));

    expect(generator).toHaveBeenCalledTimes(2);
    expect(generator).toHaveBeenNthCalledWith(1, { id: 1, name: "Item 1" }, 0);
    expect(generator).toHaveBeenNthCalledWith(2, { id: 2, name: "Item 2" }, 1);
    expect(result.current[0]._ui_unique_id).toBe("generated-1-0");
    expect(result.current[1]._ui_unique_id).toBe("generated-2-1");
  });

  it("should memoize results when data and generator do not change", () => {
    const data = [{ id: 1, name: "Item 1" }];
    const generator = (item: { id: number }, index: number) => `id-${item.id}-${index}`;

    const { result, rerender } = renderHook(() => useWithUiId(data, generator));

    const firstResult = result.current;

    // Rerender with same data and generator
    rerender();

    // Should return the same reference (memoized)
    expect(result.current).toBe(firstResult);
  });

  it("should recompute when data changes", () => {
    const generator = (item: { id: number }, index: number) => `id-${item.id}-${index}`;

    const { result, rerender } = renderHook(
      ({ data }: { data: { id: number; name: string }[] }) => useWithUiId(data, generator),
      {
        initialProps: { data: [{ id: 1, name: "Item 1" }] },
      }
    );

    const firstResult = result.current;

    // Change data
    rerender({ data: [{ id: 2, name: "Item 2" }] });

    // Should return different reference
    expect(result.current).not.toBe(firstResult);
    expect(result.current[0]._ui_unique_id).toBe("id-2-0");
  });

  it("should recompute when generator changes", () => {
    const data = [{ id: 1, name: "Item 1" }];

    const { result, rerender } = renderHook(
      ({ generator }: { generator: (item: { id: number }, index: number) => string }) => useWithUiId(data, generator),
      {
        initialProps: {
          generator: (item, index) => `id-${item.id}-${index}`,
        },
      }
    );

    const firstResult = result.current;

    // Change generator
    rerender({
      generator: (item, index) => `new-${item.id}-${index}`,
    });

    // Should return different reference
    expect(result.current).not.toBe(firstResult);
    expect(result.current[0]._ui_unique_id).toBe("new-1-0");
  });

  it("should handle complex generator functions", () => {
    const data = [
      { id: 1, name: "Item 1", category: "A" },
      { id: 2, name: "Item 2", category: "B" },
    ];

    const { result } = renderHook(() => useWithUiId(data, (item, index) => `${item.category}-${item.id}-idx${index}`));

    expect(result.current[0]._ui_unique_id).toBe("A-1-idx0");
    expect(result.current[1]._ui_unique_id).toBe("B-2-idx1");
  });
});

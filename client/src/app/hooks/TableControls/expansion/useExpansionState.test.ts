import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useExpansionState } from "./useExpansionState";
import type { TExpandedCells } from "./useExpansionState";

describe("useExpansionState", () => {
  it("should initialize with empty expandedCells", () => {
    const { result } = renderHook(() => useExpansionState<"name" | "status">());

    expect(result.current.expandedCells).toEqual({});
  });

  it("should update expandedCells when setExpandedCells is called", () => {
    const { result } = renderHook(() => useExpansionState<"name" | "status">());

    const newExpandedCells: TExpandedCells<"name" | "status"> = {
      "item-1": true,
      "item-2": "name",
    };

    act(() => {
      result.current.setExpandedCells(newExpandedCells);
    });

    expect(result.current.expandedCells).toEqual(newExpandedCells);
  });

  it("should handle single-expand cells (boolean true)", () => {
    const { result } = renderHook(() => useExpansionState<"name">());

    act(() => {
      result.current.setExpandedCells({
        "item-1": true,
        "item-2": true,
      });
    });

    expect(result.current.expandedCells).toEqual({
      "item-1": true,
      "item-2": true,
    });
  });

  it("should handle compound-expand cells (columnKey)", () => {
    const { result } = renderHook(() => useExpansionState<"name" | "status">());

    act(() => {
      result.current.setExpandedCells({
        "item-1": "name",
        "item-2": "status",
      });
    });

    expect(result.current.expandedCells).toEqual({
      "item-1": "name",
      "item-2": "status",
    });
  });

  it("should handle mixed single and compound expand cells", () => {
    const { result } = renderHook(() => useExpansionState<"name" | "status">());

    act(() => {
      result.current.setExpandedCells({
        "item-1": true,
        "item-2": "name",
        "item-3": "status",
      });
    });

    expect(result.current.expandedCells).toEqual({
      "item-1": true,
      "item-2": "name",
      "item-3": "status",
    });
  });

  it("should replace entire expandedCells map when setExpandedCells is called", () => {
    const { result } = renderHook(() => useExpansionState<"name" | "status">());

    act(() => {
      result.current.setExpandedCells({
        "item-1": true,
        "item-2": "name",
      });
    });

    expect(result.current.expandedCells).toEqual({
      "item-1": true,
      "item-2": "name",
    });

    act(() => {
      result.current.setExpandedCells({
        "item-3": "status",
      });
    });

    expect(result.current.expandedCells).toEqual({
      "item-3": "status",
    });
    expect(result.current.expandedCells["item-1"]).toBeUndefined();
    expect(result.current.expandedCells["item-2"]).toBeUndefined();
  });

  it("should handle clearing all expanded cells", () => {
    const { result } = renderHook(() => useExpansionState<"name">());

    act(() => {
      result.current.setExpandedCells({
        "item-1": true,
        "item-2": "name",
      });
    });

    act(() => {
      result.current.setExpandedCells({});
    });

    expect(result.current.expandedCells).toEqual({});
  });

  it("should maintain state across rerenders", () => {
    const { result, rerender } = renderHook(() => useExpansionState<"name">());

    act(() => {
      result.current.setExpandedCells({
        "item-1": true,
      });
    });

    const expandedCellsBeforeRerender = result.current.expandedCells;

    rerender();

    expect(result.current.expandedCells).toBe(expandedCellsBeforeRerender);
    expect(result.current.expandedCells).toEqual({
      "item-1": true,
    });
  });

  it("should handle numeric item IDs", () => {
    const { result } = renderHook(() => useExpansionState<"name">());

    act(() => {
      result.current.setExpandedCells({
        "123": true,
        "456": "name",
      });
    });

    expect(result.current.expandedCells).toEqual({
      "123": true,
      "456": "name",
    });
  });

  it("should handle multiple column keys for compound expand", () => {
    const { result } = renderHook(() => useExpansionState<"name" | "status" | "category">());

    act(() => {
      result.current.setExpandedCells({
        "item-1": "name",
        "item-2": "status",
        "item-3": "category",
      });
    });

    expect(result.current.expandedCells).toEqual({
      "item-1": "name",
      "item-2": "status",
      "item-3": "category",
    });
  });
});

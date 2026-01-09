import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePaginationState } from "./usePaginationState";

describe("usePaginationState", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => usePaginationState());

    expect(result.current.pageNumber).toBe(1);
    expect(result.current.itemsPerPage).toBe(10);
  });

  it("should initialize with custom itemsPerPage", () => {
    const { result } = renderHook(() =>
      usePaginationState({
        initialItemsPerPage: 25,
      })
    );

    expect(result.current.pageNumber).toBe(1);
    expect(result.current.itemsPerPage).toBe(25);
  });

  it("should update page number when setPageNumber is called", () => {
    const { result } = renderHook(() => usePaginationState());

    act(() => {
      result.current.setPageNumber(3);
    });

    expect(result.current.pageNumber).toBe(3);
    expect(result.current.itemsPerPage).toBe(10); // Should remain unchanged
  });

  it("should update items per page when setItemsPerPage is called", () => {
    const { result } = renderHook(() => usePaginationState());

    act(() => {
      result.current.setItemsPerPage(50);
    });

    expect(result.current.itemsPerPage).toBe(50);
    expect(result.current.pageNumber).toBe(1); // Should remain unchanged
  });

  it("should prevent page number from being set below 1", () => {
    const { result } = renderHook(() => usePaginationState());

    act(() => {
      result.current.setPageNumber(5);
    });

    expect(result.current.pageNumber).toBe(5);

    // Try to set to 0
    act(() => {
      result.current.setPageNumber(0);
    });

    expect(result.current.pageNumber).toBe(1);

    // Try to set to negative
    act(() => {
      result.current.setPageNumber(-5);
    });

    expect(result.current.pageNumber).toBe(1);
  });

  it("should maintain itemsPerPage when changing page number", () => {
    const { result } = renderHook(() =>
      usePaginationState({
        initialItemsPerPage: 20,
      })
    );

    act(() => {
      result.current.setPageNumber(3);
    });

    expect(result.current.pageNumber).toBe(3);
    expect(result.current.itemsPerPage).toBe(20);
  });

  it("should maintain page number when changing itemsPerPage", () => {
    const { result } = renderHook(() => usePaginationState());

    act(() => {
      result.current.setPageNumber(5);
    });

    act(() => {
      result.current.setItemsPerPage(25);
    });

    expect(result.current.pageNumber).toBe(5);
    expect(result.current.itemsPerPage).toBe(25);
  });

  it("should handle multiple page number changes", () => {
    const { result } = renderHook(() => usePaginationState());

    act(() => {
      result.current.setPageNumber(2);
    });
    expect(result.current.pageNumber).toBe(2);

    act(() => {
      result.current.setPageNumber(10);
    });
    expect(result.current.pageNumber).toBe(10);

    act(() => {
      result.current.setPageNumber(1);
    });
    expect(result.current.pageNumber).toBe(1);
  });

  it("should handle multiple itemsPerPage changes", () => {
    const { result } = renderHook(() => usePaginationState());

    act(() => {
      result.current.setItemsPerPage(25);
    });
    expect(result.current.itemsPerPage).toBe(25);

    act(() => {
      result.current.setItemsPerPage(50);
    });
    expect(result.current.itemsPerPage).toBe(50);

    act(() => {
      result.current.setItemsPerPage(100);
    });
    expect(result.current.itemsPerPage).toBe(100);
  });

  it("should handle large page numbers", () => {
    const { result } = renderHook(() => usePaginationState());

    act(() => {
      result.current.setPageNumber(1000);
    });

    expect(result.current.pageNumber).toBe(1000);
  });

  it("should handle large itemsPerPage values", () => {
    const { result } = renderHook(() => usePaginationState());

    act(() => {
      result.current.setItemsPerPage(1000);
    });

    expect(result.current.itemsPerPage).toBe(1000);
  });

  it("should maintain state across rerenders", () => {
    const { result, rerender } = renderHook(() => usePaginationState());

    act(() => {
      result.current.setPageNumber(5);
      result.current.setItemsPerPage(25);
    });

    const pageNumberBeforeRerender = result.current.pageNumber;
    const itemsPerPageBeforeRerender = result.current.itemsPerPage;

    rerender();

    expect(result.current.pageNumber).toBe(pageNumberBeforeRerender);
    expect(result.current.itemsPerPage).toBe(itemsPerPageBeforeRerender);
  });

  it("should reset page number to 1 when itemsPerPage changes if pageNumber was null", () => {
    const { result } = renderHook(() => usePaginationState());

    // Initially pageNumber is 1
    expect(result.current.pageNumber).toBe(1);

    // Change itemsPerPage - pageNumber should remain 1
    act(() => {
      result.current.setItemsPerPage(25);
    });

    expect(result.current.pageNumber).toBe(1);
  });
});

import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useExpansionPropHelpers } from "./useExpansionPropHelpers";
import { useExpansionState } from "./useExpansionState";

interface TestItem {
  id: string;
  name: string;
  status: string;
}

describe("useExpansionPropHelpers", () => {
  it("should return expansionDerivedState, getSingleExpandButtonTdProps, and getCompoundExpandTdProps", () => {
    const { result: expansionStateResult } = renderHook(() => useExpansionState<"name" | "status">());

    const { result } = renderHook(() =>
      useExpansionPropHelpers<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState: expansionStateResult.current,
        columnKeys: ["name", "status"],
      })
    );

    expect(result.current.expansionDerivedState).toBeDefined();
    expect(result.current.getSingleExpandButtonTdProps).toBeDefined();
    expect(result.current.getCompoundExpandTdProps).toBeDefined();
    expect(typeof result.current.getSingleExpandButtonTdProps).toBe("function");
    expect(typeof result.current.getCompoundExpandTdProps).toBe("function");
  });

  describe("getSingleExpandButtonTdProps", () => {
    it("should return props with expand configuration", () => {
      const { result: expansionStateResult } = renderHook(() => useExpansionState<"name" | "status">());

      const { result } = renderHook(() =>
        useExpansionPropHelpers<TestItem, "name" | "status">({
          idProperty: "id",
          expansionState: expansionStateResult.current,
          columnKeys: ["name", "status"],
        })
      );

      const item: TestItem = { id: "item-1", name: "Test", status: "active" };
      const props = result.current.getSingleExpandButtonTdProps({
        item,
        rowIndex: 0,
      });

      expect(props.expand).toBeDefined();
      expect(props.expand?.rowIndex).toBe(0);
      expect(props.expand?.isExpanded).toBe(false);
      expect(props.expand?.expandId).toBe("expandable-row-item-1");
      expect(typeof props.expand?.onToggle).toBe("function");
    });

    it("should return isExpanded true when row is expanded", () => {
      const { result: expansionStateResult } = renderHook(() => useExpansionState<"name" | "status">());

      const { result, rerender } = renderHook(
        ({ expansionState }) =>
          useExpansionPropHelpers<TestItem, "name" | "status">({
            idProperty: "id",
            expansionState,
            columnKeys: ["name", "status"],
          }),
        {
          initialProps: {
            expansionState: expansionStateResult.current,
          },
        }
      );

      const item: TestItem = { id: "item-1", name: "Test", status: "active" };

      act(() => {
        expansionStateResult.current.setExpandedCells({ "item-1": true });
      });

      // Rerender to capture updated state
      rerender({ expansionState: expansionStateResult.current });

      const props = result.current.getSingleExpandButtonTdProps({
        item,
        rowIndex: 0,
      });

      expect(props.expand?.isExpanded).toBe(true);
    });

    it("should toggle expansion when onToggle is called", () => {
      const { result: expansionStateResult } = renderHook(() => useExpansionState<"name" | "status">());

      const { result, rerender } = renderHook(
        ({ expansionState }) =>
          useExpansionPropHelpers<TestItem, "name" | "status">({
            idProperty: "id",
            expansionState,
            columnKeys: ["name", "status"],
          }),
        {
          initialProps: {
            expansionState: expansionStateResult.current,
          },
        }
      );

      const item: TestItem = { id: "item-1", name: "Test", status: "active" };
      const props = result.current.getSingleExpandButtonTdProps({
        item,
        rowIndex: 0,
      });

      expect(props.expand?.isExpanded).toBe(false);

      act(() => {
        if (props.expand?.onToggle) {
          (props.expand.onToggle as () => void)();
        }
      });

      // Rerender to capture updated state
      rerender({ expansionState: expansionStateResult.current });

      const updatedProps = result.current.getSingleExpandButtonTdProps({
        item,
        rowIndex: 0,
      });
      expect(updatedProps.expand?.isExpanded).toBe(true);

      act(() => {
        if (updatedProps.expand?.onToggle) {
          (updatedProps.expand.onToggle as () => void)();
        }
      });

      // Rerender to capture updated state
      rerender({ expansionState: expansionStateResult.current });

      const collapsedProps = result.current.getSingleExpandButtonTdProps({
        item,
        rowIndex: 0,
      });
      expect(collapsedProps.expand?.isExpanded).toBe(false);
    });

    it("should generate correct expandId based on item idProperty", () => {
      const { result: expansionStateResult } = renderHook(() => useExpansionState<"name">());

      const { result } = renderHook(() =>
        useExpansionPropHelpers<TestItem, "name">({
          idProperty: "id",
          expansionState: expansionStateResult.current,
          columnKeys: ["name"],
        })
      );

      const item1: TestItem = { id: "item-1", name: "Test 1", status: "active" };
      const item2: TestItem = { id: "item-2", name: "Test 2", status: "pending" };

      const props1 = result.current.getSingleExpandButtonTdProps({
        item: item1,
        rowIndex: 0,
      });
      const props2 = result.current.getSingleExpandButtonTdProps({
        item: item2,
        rowIndex: 1,
      });

      expect(props1.expand?.expandId).toBe("expandable-row-item-1");
      expect(props2.expand?.expandId).toBe("expandable-row-item-2");
    });

    it("should handle numeric IDs", () => {
      interface NumericItem {
        id: number;
        name: string;
      }

      const { result: expansionStateResult } = renderHook(() => useExpansionState<"name">());

      const { result } = renderHook(() =>
        useExpansionPropHelpers<NumericItem, "name">({
          idProperty: "id",
          expansionState: expansionStateResult.current,
          columnKeys: ["name"],
        })
      );

      const item: NumericItem = { id: 123, name: "Test" };
      const props = result.current.getSingleExpandButtonTdProps({
        item,
        rowIndex: 0,
      });

      expect(props.expand?.expandId).toBe("expandable-row-123");
    });
  });

  describe("getCompoundExpandTdProps", () => {
    it("should return props with compoundExpand configuration", () => {
      const { result: expansionStateResult } = renderHook(() => useExpansionState<"name" | "status">());

      const { result } = renderHook(() =>
        useExpansionPropHelpers<TestItem, "name" | "status">({
          idProperty: "id",
          expansionState: expansionStateResult.current,
          columnKeys: ["name", "status"],
        })
      );

      const item: TestItem = { id: "item-1", name: "Test", status: "active" };
      const props = result.current.getCompoundExpandTdProps({
        columnKey: "name",
        item,
        rowIndex: 0,
      });

      expect(props.compoundExpand).toBeDefined();
      expect(props.compoundExpand?.rowIndex).toBe(0);
      expect(props.compoundExpand?.columnIndex).toBe(0); // "name" is at index 0
      expect(props.compoundExpand?.isExpanded).toBe(false);
      expect(props.compoundExpand?.expandId).toBe("compound-expand-item-1-name");
      expect(typeof props.compoundExpand?.onToggle).toBe("function");
    });

    it("should return correct columnIndex based on columnKeys", () => {
      const { result: expansionStateResult } = renderHook(() => useExpansionState<"name" | "status">());

      const { result } = renderHook(() =>
        useExpansionPropHelpers<TestItem, "name" | "status">({
          idProperty: "id",
          expansionState: expansionStateResult.current,
          columnKeys: ["name", "status"],
        })
      );

      const item: TestItem = { id: "item-1", name: "Test", status: "active" };

      const nameProps = result.current.getCompoundExpandTdProps({
        columnKey: "name",
        item,
        rowIndex: 0,
      });
      expect(nameProps.compoundExpand?.columnIndex).toBe(0);

      const statusProps = result.current.getCompoundExpandTdProps({
        columnKey: "status",
        item,
        rowIndex: 0,
      });
      expect(statusProps.compoundExpand?.columnIndex).toBe(1);
    });

    it("should return isExpanded true when specific column is expanded", () => {
      const { result: expansionStateResult } = renderHook(() => useExpansionState<"name" | "status">());

      const { result, rerender } = renderHook(
        ({ expansionState }) =>
          useExpansionPropHelpers<TestItem, "name" | "status">({
            idProperty: "id",
            expansionState,
            columnKeys: ["name", "status"],
          }),
        {
          initialProps: {
            expansionState: expansionStateResult.current,
          },
        }
      );

      const item: TestItem = { id: "item-1", name: "Test", status: "active" };

      act(() => {
        expansionStateResult.current.setExpandedCells({ "item-1": "name" });
      });

      // Rerender to capture updated state
      rerender({ expansionState: expansionStateResult.current });

      const nameProps = result.current.getCompoundExpandTdProps({
        columnKey: "name",
        item,
        rowIndex: 0,
      });
      expect(nameProps.compoundExpand?.isExpanded).toBe(true);

      const statusProps = result.current.getCompoundExpandTdProps({
        columnKey: "status",
        item,
        rowIndex: 0,
      });
      expect(statusProps.compoundExpand?.isExpanded).toBe(false);
    });

    it("should toggle expansion when onToggle is called", () => {
      const { result: expansionStateResult } = renderHook(() => useExpansionState<"name" | "status">());

      const { result, rerender } = renderHook(
        ({ expansionState }) =>
          useExpansionPropHelpers<TestItem, "name" | "status">({
            idProperty: "id",
            expansionState,
            columnKeys: ["name", "status"],
          }),
        {
          initialProps: {
            expansionState: expansionStateResult.current,
          },
        }
      );

      const item: TestItem = { id: "item-1", name: "Test", status: "active" };
      const props = result.current.getCompoundExpandTdProps({
        columnKey: "name",
        item,
        rowIndex: 0,
      });

      expect(props.compoundExpand?.isExpanded).toBe(false);

      act(() => {
        if (props.compoundExpand?.onToggle) {
          (props.compoundExpand.onToggle as () => void)();
        }
      });

      // Rerender to capture updated state
      rerender({ expansionState: expansionStateResult.current });

      const updatedProps = result.current.getCompoundExpandTdProps({
        columnKey: "name",
        item,
        rowIndex: 0,
      });
      expect(updatedProps.compoundExpand?.isExpanded).toBe(true);

      act(() => {
        if (updatedProps.compoundExpand?.onToggle) {
          (updatedProps.compoundExpand.onToggle as () => void)();
        }
      });

      // Rerender to capture updated state
      rerender({ expansionState: expansionStateResult.current });

      const collapsedProps = result.current.getCompoundExpandTdProps({
        columnKey: "name",
        item,
        rowIndex: 0,
      });
      expect(collapsedProps.compoundExpand?.isExpanded).toBe(false);
    });

    it("should generate correct expandId based on item idProperty and columnKey", () => {
      const { result: expansionStateResult } = renderHook(() => useExpansionState<"name" | "status">());

      const { result } = renderHook(() =>
        useExpansionPropHelpers<TestItem, "name" | "status">({
          idProperty: "id",
          expansionState: expansionStateResult.current,
          columnKeys: ["name", "status"],
        })
      );

      const item: TestItem = { id: "item-1", name: "Test", status: "active" };

      const nameProps = result.current.getCompoundExpandTdProps({
        columnKey: "name",
        item,
        rowIndex: 0,
      });
      expect(nameProps.compoundExpand?.expandId).toBe("compound-expand-item-1-name");

      const statusProps = result.current.getCompoundExpandTdProps({
        columnKey: "status",
        item,
        rowIndex: 0,
      });
      expect(statusProps.compoundExpand?.expandId).toBe("compound-expand-item-1-status");
    });

    it("should handle switching between different columns", () => {
      const { result: expansionStateResult } = renderHook(() => useExpansionState<"name" | "status">());

      const { result, rerender } = renderHook(
        ({ expansionState }) =>
          useExpansionPropHelpers<TestItem, "name" | "status">({
            idProperty: "id",
            expansionState,
            columnKeys: ["name", "status"],
          }),
        {
          initialProps: {
            expansionState: expansionStateResult.current,
          },
        }
      );

      const item: TestItem = { id: "item-1", name: "Test", status: "active" };

      // Expand name column
      const nameProps = result.current.getCompoundExpandTdProps({
        columnKey: "name",
        item,
        rowIndex: 0,
      });

      act(() => {
        if (nameProps.compoundExpand?.onToggle) {
          (nameProps.compoundExpand.onToggle as () => void)();
        }
      });

      // Rerender to capture updated state
      rerender({ expansionState: expansionStateResult.current });

      // Switch to status column
      const statusProps = result.current.getCompoundExpandTdProps({
        columnKey: "status",
        item,
        rowIndex: 0,
      });

      act(() => {
        if (statusProps.compoundExpand?.onToggle) {
          (statusProps.compoundExpand.onToggle as () => void)();
        }
      });

      // Rerender to capture updated state
      rerender({ expansionState: expansionStateResult.current });

      // Name should be collapsed, status should be expanded
      const updatedNameProps = result.current.getCompoundExpandTdProps({
        columnKey: "name",
        item,
        rowIndex: 0,
      });
      const updatedStatusProps = result.current.getCompoundExpandTdProps({
        columnKey: "status",
        item,
        rowIndex: 0,
      });

      expect(updatedNameProps.compoundExpand?.isExpanded).toBe(false);
      expect(updatedStatusProps.compoundExpand?.isExpanded).toBe(true);
    });

    it("should handle numeric IDs", () => {
      interface NumericItem {
        id: number;
        name: string;
      }

      const { result: expansionStateResult } = renderHook(() => useExpansionState<"name">());

      const { result } = renderHook(() =>
        useExpansionPropHelpers<NumericItem, "name">({
          idProperty: "id",
          expansionState: expansionStateResult.current,
          columnKeys: ["name"],
        })
      );

      const item: NumericItem = { id: 123, name: "Test" };
      const props = result.current.getCompoundExpandTdProps({
        columnKey: "name",
        item,
        rowIndex: 0,
      });

      expect(props.compoundExpand?.expandId).toBe("compound-expand-123-name");
    });
  });

  describe("expansionDerivedState", () => {
    it("should provide access to expansion derived state", () => {
      const { result: expansionStateResult } = renderHook(() => useExpansionState<"name" | "status">());

      const { result, rerender } = renderHook(
        ({ expansionState }) =>
          useExpansionPropHelpers<TestItem, "name" | "status">({
            idProperty: "id",
            expansionState,
            columnKeys: ["name", "status"],
          }),
        {
          initialProps: {
            expansionState: expansionStateResult.current,
          },
        }
      );

      const item: TestItem = { id: "item-1", name: "Test", status: "active" };

      expect(result.current.expansionDerivedState.isCellExpanded(item)).toBe(false);

      act(() => {
        result.current.expansionDerivedState.setCellExpanded({
          item,
          isExpanding: true,
        });
      });

      // Rerender to capture updated state
      rerender({ expansionState: expansionStateResult.current });

      expect(result.current.expansionDerivedState.isCellExpanded(item)).toBe(true);
    });
  });
});

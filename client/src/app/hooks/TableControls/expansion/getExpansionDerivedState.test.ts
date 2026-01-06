import { describe, expect, it, vi } from "vitest";
import { getExpansionDerivedState } from "./getExpansionDerivedState";
import type { IExpansionState } from "./useExpansionState";

interface TestItem {
  id: string;
  name: string;
}

describe("getExpansionDerivedState", () => {
  const createMockExpansionState = <TColumnKey extends string = "name" | "status">(): IExpansionState<TColumnKey> => {
    const expandedCells: Record<string, TColumnKey | boolean> = {};
    const setExpandedCells = vi.fn((newExpandedCells: typeof expandedCells) => {
      Object.keys(expandedCells).forEach((key) => delete expandedCells[key]);
      Object.assign(expandedCells, newExpandedCells);
    });

    return {
      get expandedCells() {
        return { ...expandedCells };
      },
      setExpandedCells,
    };
  };

  it("should return isCellExpanded and setCellExpanded functions", () => {
    const expansionState = createMockExpansionState();
    const derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
      idProperty: "id",
      expansionState,
    });

    expect(derivedState.isCellExpanded).toBeDefined();
    expect(typeof derivedState.isCellExpanded).toBe("function");
    expect(derivedState.setCellExpanded).toBeDefined();
    expect(typeof derivedState.setCellExpanded).toBe("function");
  });

  describe("isCellExpanded", () => {
    it("should return false when item is not expanded (no columnKey)", () => {
      const expansionState = createMockExpansionState();
      const derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });

      const item: TestItem = { id: "item-1", name: "Test" };

      expect(derivedState.isCellExpanded(item)).toBe(false);
    });

    it("should return true when item row is expanded (single-expand, no columnKey)", () => {
      const expansionState = createMockExpansionState();
      expansionState.setExpandedCells({ "item-1": true });
      // Recreate derived state after updating expansion state to capture new state
      const derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });

      const item: TestItem = { id: "item-1", name: "Test" };

      expect(derivedState.isCellExpanded(item)).toBe(true);
    });

    it("should return true when item has compound-expanded cell (no columnKey)", () => {
      const expansionState = createMockExpansionState();
      expansionState.setExpandedCells({ "item-1": "name" });
      const derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });

      const item: TestItem = { id: "item-1", name: "Test" };

      expect(derivedState.isCellExpanded(item)).toBe(true);
    });

    it("should return false when specific column is not expanded (with columnKey)", () => {
      const expansionState = createMockExpansionState();
      expansionState.setExpandedCells({ "item-1": true });
      const derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });

      const item: TestItem = { id: "item-1", name: "Test" };

      expect(derivedState.isCellExpanded(item, "name")).toBe(false);
    });

    it("should return true when specific column is expanded (with columnKey)", () => {
      const expansionState = createMockExpansionState();
      expansionState.setExpandedCells({ "item-1": "name" });
      const derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });

      const item: TestItem = { id: "item-1", name: "Test" };

      expect(derivedState.isCellExpanded(item, "name")).toBe(true);
      expect(derivedState.isCellExpanded(item, "status")).toBe(false);
    });

    it("should handle numeric IDs", () => {
      interface NumericItem {
        id: number;
        name: string;
      }

      const expansionState = createMockExpansionState<"name">();
      expansionState.setExpandedCells({ "123": "name" });
      const derivedState = getExpansionDerivedState<NumericItem, "name">({
        idProperty: "id",
        expansionState,
      });

      const item: NumericItem = { id: 123, name: "Test" };

      expect(derivedState.isCellExpanded(item, "name")).toBe(true);
    });
  });

  describe("setCellExpanded", () => {
    it("should expand a row (single-expand, no columnKey)", () => {
      const expansionState = createMockExpansionState();
      let derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });

      const item: TestItem = { id: "item-1", name: "Test" };

      derivedState.setCellExpanded({ item, isExpanding: true });

      expect(expansionState.setExpandedCells).toHaveBeenCalledWith({
        "item-1": true,
      });
      // Recreate derived state to see the updated state
      derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });
      expect(derivedState.isCellExpanded(item)).toBe(true);
    });

    it("should collapse a row (single-expand, no columnKey)", () => {
      const expansionState = createMockExpansionState();
      expansionState.setExpandedCells({ "item-1": true });
      let derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });

      const item: TestItem = { id: "item-1", name: "Test" };

      derivedState.setCellExpanded({ item, isExpanding: false });

      expect(expansionState.setExpandedCells).toHaveBeenCalledWith({});
      // Recreate derived state to see the updated state
      derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });
      expect(derivedState.isCellExpanded(item)).toBe(false);
    });

    it("should expand a specific column cell (compound-expand, with columnKey)", () => {
      const expansionState = createMockExpansionState();
      let derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });

      const item: TestItem = { id: "item-1", name: "Test" };

      derivedState.setCellExpanded({ item, isExpanding: true, columnKey: "name" });

      expect(expansionState.setExpandedCells).toHaveBeenCalledWith({
        "item-1": "name",
      });
      // Recreate derived state to see the updated state
      derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });
      expect(derivedState.isCellExpanded(item, "name")).toBe(true);
    });

    it("should collapse a specific column cell (compound-expand, with columnKey)", () => {
      const expansionState = createMockExpansionState();
      expansionState.setExpandedCells({ "item-1": "name" });
      let derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });

      const item: TestItem = { id: "item-1", name: "Test" };

      derivedState.setCellExpanded({ item, isExpanding: false, columnKey: "name" });

      expect(expansionState.setExpandedCells).toHaveBeenCalledWith({});
      // Recreate derived state to see the updated state
      derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });
      expect(derivedState.isCellExpanded(item, "name")).toBe(false);
    });

    it("should default isExpanding to true when not provided", () => {
      const expansionState = createMockExpansionState();
      let derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });

      const item: TestItem = { id: "item-1", name: "Test" };

      derivedState.setCellExpanded({ item });

      expect(expansionState.setExpandedCells).toHaveBeenCalledWith({
        "item-1": true,
      });
      // Recreate derived state to see the updated state
      derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });
      expect(derivedState.isCellExpanded(item)).toBe(true);
    });

    it("should handle switching from one expanded column to another", () => {
      const expansionState = createMockExpansionState();
      expansionState.setExpandedCells({ "item-1": "name" });
      let derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });

      const item: TestItem = { id: "item-1", name: "Test" };

      derivedState.setCellExpanded({ item, isExpanding: true, columnKey: "status" });

      expect(expansionState.setExpandedCells).toHaveBeenCalledWith({
        "item-1": "status",
      });
      // Recreate derived state to see the updated state
      derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });
      expect(derivedState.isCellExpanded(item, "name")).toBe(false);
      expect(derivedState.isCellExpanded(item, "status")).toBe(true);
    });

    it("should handle multiple items independently", () => {
      const expansionState = createMockExpansionState();
      let derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });

      const item1: TestItem = { id: "item-1", name: "Test 1" };
      const item2: TestItem = { id: "item-2", name: "Test 2" };

      // Expand first item
      derivedState.setCellExpanded({ item: item1, isExpanding: true, columnKey: "name" });
      // Recreate derived state to capture the update
      derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });

      // Expand second item
      derivedState.setCellExpanded({ item: item2, isExpanding: true, columnKey: "status" });

      // Recreate derived state to see both updates
      derivedState = getExpansionDerivedState<TestItem, "name" | "status">({
        idProperty: "id",
        expansionState,
      });

      expect(derivedState.isCellExpanded(item1, "name")).toBe(true);
      expect(derivedState.isCellExpanded(item2, "status")).toBe(true);
      expect(derivedState.isCellExpanded(item1, "status")).toBe(false);
      expect(derivedState.isCellExpanded(item2, "name")).toBe(false);
    });

    it("should handle numeric IDs", () => {
      interface NumericItem {
        id: number;
        name: string;
      }

      const expansionState = createMockExpansionState<"name">();
      let derivedState = getExpansionDerivedState<NumericItem, "name">({
        idProperty: "id",
        expansionState,
      });

      const item: NumericItem = { id: 123, name: "Test" };

      derivedState.setCellExpanded({ item, isExpanding: true, columnKey: "name" });

      expect(expansionState.setExpandedCells).toHaveBeenCalledWith({
        "123": "name",
      });
      // Recreate derived state to see the updated state
      derivedState = getExpansionDerivedState<NumericItem, "name">({
        idProperty: "id",
        expansionState,
      });
      expect(derivedState.isCellExpanded(item, "name")).toBe(true);
    });
  });
});

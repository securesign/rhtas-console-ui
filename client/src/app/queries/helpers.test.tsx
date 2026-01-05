import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the ENV module before importing the hook
vi.mock("@app/env", () => ({
  default: {
    MOCK: "on",
  },
}));

// Mock the helpers module to make mockPromise resolve immediately
vi.mock("./helpers", async () => {
  const actual = await vi.importActual<typeof import("./helpers")>("./helpers");
  return {
    ...actual,
    // We'll test the actual implementation, but the timeout will be handled by waitFor
  };
});

import { useMockableQuery } from "./helpers";

describe("useMockableQuery", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0, // Disable garbage collection for tests
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("should return mock data when MOCK is not 'off'", async () => {
    const mockData = { id: 1, name: "Test" };
    const queryFn = vi.fn().mockResolvedValue({ id: 2, name: "Real" });

    const { result } = renderHook(
      () =>
        useMockableQuery(
          {
            queryKey: ["test"],
            queryFn,
          },
          mockData
        ),
      { wrapper }
    );

    // Wait for the query to complete (mockPromise has 1000ms timeout)
    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 2000 }
    );

    expect(result.current.data).toEqual(mockData);
    // queryFn should not be called when mocking
    expect(queryFn).not.toHaveBeenCalled();
  });

  // Note: Testing MOCK="off" mode would require module re-import which is complex.
  // The hook behavior when MOCK="off" is that it uses the real queryFn.
  // This is tested indirectly through integration tests of actual query hooks.

  it("should handle query errors in mock mode", async () => {
    const mockData = { id: 1, name: "Test" };
    const queryFn = vi.fn().mockRejectedValue(new Error("Real error"));

    const { result } = renderHook(
      () =>
        useMockableQuery(
          {
            queryKey: ["test-error"],
            queryFn,
          },
          mockData
        ),
      { wrapper }
    );

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 2000 }
    );

    // In mock mode, errors are not propagated - mock data is returned
    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBe(false);
  });

  it("should respect query options like enabled", async () => {
    const mockData = { id: 1, name: "Test" };
    const queryFn = vi.fn().mockResolvedValue({ id: 2, name: "Real" });

    const { result, rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) =>
        useMockableQuery(
          {
            queryKey: ["test-enabled"],
            queryFn,
            enabled,
          },
          mockData
        ),
      {
        wrapper,
        initialProps: { enabled: false },
      }
    );

    // Query should not run when disabled
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();

    // Enable the query
    rerender({ enabled: true });

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 2000 }
    );

    expect(result.current.data).toEqual(mockData);
  });

  it("should respect queryKey changes", async () => {
    const mockData1 = { id: 1, name: "Test1" };
    const mockData2 = { id: 2, name: "Test2" };
    const queryFn = vi.fn().mockResolvedValue({ id: 3, name: "Real" });

    const { result, rerender } = renderHook(
      ({ queryKey }: { queryKey: readonly unknown[] }) =>
        useMockableQuery(
          {
            queryKey,
            queryFn,
          },
          queryKey[1] === "key1" ? mockData1 : mockData2
        ),
      {
        wrapper,
        initialProps: { queryKey: ["test", "key1"] as const },
      }
    );

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 2000 }
    );

    expect(result.current.data).toEqual(mockData1);

    // Change query key
    rerender({ queryKey: ["test", "key2"] as const });

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 2000 }
    );

    expect(result.current.data).toEqual(mockData2);
  });

  it("should handle refetch functionality", async () => {
    const mockData = { id: 1, name: "Test" };
    const queryFn = vi.fn().mockResolvedValue({ id: 2, name: "Real" });

    const { result } = renderHook(
      () =>
        useMockableQuery(
          {
            queryKey: ["test-refetch"],
            queryFn,
          },
          mockData
        ),
      { wrapper }
    );

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 2000 }
    );

    expect(result.current.data).toEqual(mockData);

    // Refetch should work (though it will still return mock data)
    await result.current.refetch();

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 2000 }
    );

    expect(result.current.data).toEqual(mockData);
  });
});

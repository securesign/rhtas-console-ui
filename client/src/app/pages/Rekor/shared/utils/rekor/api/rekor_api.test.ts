/// <reference types="vitest/globals" />

import { renderHook } from "@testing-library/react";
import { vi, type Mock } from "vitest";
import { useRekorSearch, withTimeout, TimeoutError } from "./rekor-api";
import { useRekorClient } from "./context";

vi.mock("./context", () => ({
  useRekorClient: vi.fn(),
}));

Object.defineProperty(global.self, "crypto", {
  value: {
    subtle: {
      digest: vi.fn().mockImplementation(() => {
        const hashBuffer = new ArrayBuffer(32);
        const hashArray = new Uint8Array(hashBuffer);
        hashArray.fill(0);
        return hashBuffer;
      }),
    },
  },
});

describe("withTimeout", () => {
  it("resolves when promise completes before timeout", async () => {
    const result = await withTimeout(Promise.resolve("ok") as Promise<string> & { cancel?: () => void }, 1000);
    expect(result).toBe("ok");
  });

  it("propagates rejection when promise rejects before timeout", async () => {
    const error = new Error("upstream failure");
    await expect(withTimeout(Promise.reject(error) as Promise<never> & { cancel?: () => void }, 1000)).rejects.toThrow(
      "upstream failure"
    );
  });

  it("throws TimeoutError and calls cancel when timeout fires", async () => {
    const cancel = vi.fn();
    const hung = Object.assign(new Promise<never>(() => {}), { cancel });

    await expect(withTimeout(hung, 50)).rejects.toThrow(TimeoutError);
    expect(cancel).toHaveBeenCalled();
  });
});

describe("useRekorSearch", () => {
  it("searches by logIndex", async () => {
    const mockGetLogEntryByIndex = vi.fn().mockResolvedValue(0);

    (useRekorClient as Mock).mockReturnValue({
      entries: { getLogEntryByIndex: mockGetLogEntryByIndex },
    });

    const { result } = renderHook(() => useRekorSearch());

    await result.current({ attribute: "logIndex", query: 123 });

    expect(mockGetLogEntryByIndex).toHaveBeenCalledWith({ logIndex: 123 });
  });
});

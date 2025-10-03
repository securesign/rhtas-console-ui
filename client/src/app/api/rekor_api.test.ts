/// <reference types="vitest/globals" />
import { renderHook } from "@testing-library/react";
import { vi, type Mock } from "vitest";
import { useRekorSearch } from "./rekor-api";
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

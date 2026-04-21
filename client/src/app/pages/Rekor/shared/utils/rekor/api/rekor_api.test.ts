/// <reference types="vitest/globals" />

import { renderHook } from "@testing-library/react";
import { vi, type Mock } from "vitest";
import { useRekorSearch, withTimeout, TimeoutError, isAttribute, detectAttribute } from "./rekor-api";
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

describe("isAttribute", () => {
  it("returns true for valid attributes", () => {
    expect(isAttribute("email")).toBe(true);
    expect(isAttribute("hash")).toBe(true);
    expect(isAttribute("commitSha")).toBe(true);
    expect(isAttribute("uuid")).toBe(true);
    expect(isAttribute("logIndex")).toBe(true);
  });

  it("returns false for invalid attributes", () => {
    expect(isAttribute("bogus")).toBe(false);
    expect(isAttribute("")).toBe(false);
  });
});

describe("detectAttribute", () => {
  it("detects email", () => {
    expect(detectAttribute("user@example.com")).toBe("email");
  });

  it("detects sha256 hash", () => {
    expect(detectAttribute("sha256:" + "a".repeat(64))).toBe("hash");
  });

  it("detects sha1 hash", () => {
    expect(detectAttribute("sha1:" + "a".repeat(40))).toBe("hash");
  });

  it("detects 80-char uuid", () => {
    expect(detectAttribute("a".repeat(80))).toBe("uuid");
  });

  it("detects 64-char uuid", () => {
    expect(detectAttribute("a".repeat(64))).toBe("uuid");
  });

  it("detects 40-char commitSha", () => {
    expect(detectAttribute("a".repeat(40))).toBe("commitSha");
  });

  it("detects logIndex", () => {
    expect(detectAttribute("42")).toBe("logIndex");
  });

  it("returns null for unrecognized input", () => {
    expect(detectAttribute("not-a-known-format")).toBeNull();
  });
});

describe("useRekorSearch", () => {
  const mockEntry = { uuid: "test-entry" };

  function mockClient(overrides: Record<string, unknown> = {}) {
    const client = {
      entries: {
        getLogEntryByIndex: vi.fn().mockResolvedValue(mockEntry),
        getLogEntryByUuid: vi.fn().mockResolvedValue(mockEntry),
      },
      index: {
        searchIndex: vi.fn().mockResolvedValue(["uuid1", "uuid2"]),
      },
      ...overrides,
    };
    (useRekorClient as Mock).mockReturnValue(client);
    return client;
  }

  it("searches by logIndex", async () => {
    const client = mockClient();
    const { result } = renderHook(() => useRekorSearch());

    const res = await result.current({ attribute: "logIndex", query: 123 });

    expect(client.entries.getLogEntryByIndex).toHaveBeenCalledWith({ logIndex: 123 });
    expect(res).toEqual({ totalCount: 1, entries: [mockEntry] });
  });

  it("searches by uuid", async () => {
    const client = mockClient();
    const { result } = renderHook(() => useRekorSearch());

    const res = await result.current({ attribute: "uuid", query: "abc123" });

    expect(client.entries.getLogEntryByUuid).toHaveBeenCalledWith({ entryUuid: "abc123" });
    expect(res).toEqual({ totalCount: 1, entries: [mockEntry] });
  });

  it("searches by email", async () => {
    const client = mockClient();
    const { result } = renderHook(() => useRekorSearch());

    const res = await result.current({ attribute: "email", query: "user@example.com" });

    expect(client.index.searchIndex).toHaveBeenCalledWith({ query: { email: "user@example.com" } });
    expect(res.totalCount).toBe(2);
  });

  it("searches by hash with sha256 prefix", async () => {
    const client = mockClient();
    const { result } = renderHook(() => useRekorSearch());
    const hashValue = "sha256:" + "a".repeat(64);

    await result.current({ attribute: "hash", query: hashValue });

    expect(client.index.searchIndex).toHaveBeenCalledWith({ query: { hash: hashValue } });
  });

  it("searches by hash without sha256 prefix", async () => {
    const client = mockClient();
    const { result } = renderHook(() => useRekorSearch());
    const rawHash = "b".repeat(64);

    await result.current({ attribute: "hash", query: rawHash });

    expect(client.index.searchIndex).toHaveBeenCalledWith({ query: { hash: `sha256:${rawHash}` } });
  });

  it("searches by commitSha", async () => {
    const client = mockClient();
    const { result } = renderHook(() => useRekorSearch());

    await result.current({ attribute: "commitSha", query: "abc123" });

    expect(client.index.searchIndex).toHaveBeenCalledWith({
      query: { hash: "sha256:" + "0".repeat(64) },
    });
  });

  it("paginates results from queryEntries", async () => {
    const uuids = Array.from({ length: 25 }, (_, i) => `uuid-${i}`);
    const client = mockClient();
    client.index.searchIndex.mockResolvedValue(uuids);

    const { result } = renderHook(() => useRekorSearch());
    const res = await result.current({ attribute: "email", query: "user@example.com" }, 2);

    expect(res.totalCount).toBe(25);
    expect(client.entries.getLogEntryByUuid).toHaveBeenCalledTimes(5);
  });
});

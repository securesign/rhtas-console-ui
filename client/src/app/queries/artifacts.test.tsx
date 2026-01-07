import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the ENV module before importing the hooks
vi.mock("@app/env", () => ({
  default: {
    MOCK: "on",
  },
}));

// Mock the API client
vi.mock("@app/axios-config/apiInit", () => ({
  client: {},
}));

// Mock the API functions
vi.mock("@app/client", async () => {
  const actual = await vi.importActual<typeof import("@app/client")>("@app/client");
  return {
    ...actual,
    getApiV1ArtifactsImage: vi.fn(),
    postApiV1ArtifactsVerify: vi.fn(),
  };
});

import { useFetchArtifactsImageData, useVerifyArtifact, ArtifactsKeys } from "./artifacts";
import { artifactsImageDataMock, artifactVerificationViewModelMock } from "./mocks/artifacts.mock";

describe("Artifacts Queries", () => {
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
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe("useFetchArtifactsImageData", () => {
    it("should return mock image data when uri is provided", async () => {
      const testUri = "https://example.com/image:latest";

      const { result } = renderHook(() => useFetchArtifactsImageData({ uri: testUri }), { wrapper });

      await waitFor(
        () => {
          expect(result.current.artifact).toBeDefined();
        },
        { timeout: 2000 }
      );

      expect(result.current.artifact).toEqual(artifactsImageDataMock);
      expect(result.current.isFetching).toBe(false);
      expect(result.current.fetchError).toBeNull();
    });

    it("should not fetch when uri is null", () => {
      const { result } = renderHook(() => useFetchArtifactsImageData({ uri: null }), { wrapper });

      expect(result.current.artifact).toBeUndefined();
      expect(result.current.isFetching).toBe(false);
    });

    it("should not fetch when uri is undefined", () => {
      const { result } = renderHook(() => useFetchArtifactsImageData({ uri: undefined }), { wrapper });

      expect(result.current.artifact).toBeUndefined();
      expect(result.current.isFetching).toBe(false);
    });

    it("should not fetch when uri is empty string", () => {
      const { result } = renderHook(() => useFetchArtifactsImageData({ uri: "" }), { wrapper });

      expect(result.current.artifact).toBeUndefined();
      expect(result.current.isFetching).toBe(false);
    });

    it("should not fetch when uri is whitespace only", () => {
      const { result } = renderHook(() => useFetchArtifactsImageData({ uri: "   " }), { wrapper });

      expect(result.current.artifact).toBeUndefined();
      expect(result.current.isFetching).toBe(false);
    });

    it("should use correct query key based on uri", async () => {
      const testUri = "https://example.com/image:latest";

      const { result } = renderHook(() => useFetchArtifactsImageData({ uri: testUri }), { wrapper });

      await waitFor(
        () => {
          expect(result.current.artifact).toBeDefined();
        },
        { timeout: 2000 }
      );

      // Verify the query is cached with the correct key
      const queryData = queryClient.getQueryData(ArtifactsKeys.image(testUri));
      expect(queryData).toEqual(artifactsImageDataMock);
    });

    it("should handle refetch", async () => {
      const testUri = "https://example.com/image:latest";

      const { result } = renderHook(() => useFetchArtifactsImageData({ uri: testUri }), { wrapper });

      await waitFor(
        () => {
          expect(result.current.artifact).toBeDefined();
        },
        { timeout: 2000 }
      );

      const initialData = result.current.artifact;
      expect(initialData).toEqual(artifactsImageDataMock);

      // Refetch should work
      await result.current.refetch();

      await waitFor(
        () => {
          expect(result.current.artifact).toBeDefined();
        },
        { timeout: 2000 }
      );

      expect(result.current.artifact).toEqual(artifactsImageDataMock);
    });

    it("should update query when uri changes", async () => {
      const uri1 = "https://example.com/image1:latest";
      const uri2 = "https://example.com/image2:latest";

      const { result, rerender } = renderHook(
        ({ uri }: { uri: string | null | undefined }) => useFetchArtifactsImageData({ uri }),
        {
          wrapper,
          initialProps: { uri: uri1 },
        }
      );

      await waitFor(
        () => {
          expect(result.current.artifact).toBeDefined();
        },
        { timeout: 2000 }
      );

      expect(result.current.artifact).toEqual(artifactsImageDataMock);

      // Change URI
      rerender({ uri: uri2 });

      await waitFor(
        () => {
          expect(result.current.artifact).toBeDefined();
        },
        { timeout: 2000 }
      );

      // Should still return mock data (same mock for both URIs in test)
      expect(result.current.artifact).toEqual(artifactsImageDataMock);
    });
  });

  describe("useVerifyArtifact", () => {
    it("should return mock verification data when uri is provided", async () => {
      const testUri = "https://example.com/image:latest";

      const { result } = renderHook(() => useVerifyArtifact({ uri: testUri }), { wrapper });

      await waitFor(
        () => {
          expect(result.current.verification).toBeDefined();
        },
        { timeout: 2000 }
      );

      expect(result.current.verification).toEqual(artifactVerificationViewModelMock);
      expect(result.current.isFetching).toBe(false);
      expect(result.current.fetchError).toBeNull();
    });

    it("should return mock verification data with expectedSAN", async () => {
      const testUri = "https://example.com/image:latest";
      const expectedSAN = "test@example.com";

      const { result } = renderHook(() => useVerifyArtifact({ uri: testUri, expectedSAN }), { wrapper });

      await waitFor(
        () => {
          expect(result.current.verification).toBeDefined();
        },
        { timeout: 2000 }
      );

      expect(result.current.verification).toEqual(artifactVerificationViewModelMock);
    });

    it("should not fetch when uri is null", () => {
      const { result } = renderHook(() => useVerifyArtifact({ uri: null }), { wrapper });

      expect(result.current.verification).toBeUndefined();
      expect(result.current.isFetching).toBe(false);
    });

    it("should not fetch when uri is undefined", () => {
      const { result } = renderHook(() => useVerifyArtifact({ uri: undefined }), { wrapper });

      expect(result.current.verification).toBeUndefined();
      expect(result.current.isFetching).toBe(false);
    });

    it("should not fetch when uri is empty string", () => {
      const { result } = renderHook(() => useVerifyArtifact({ uri: "" }), { wrapper });

      expect(result.current.verification).toBeUndefined();
      expect(result.current.isFetching).toBe(false);
    });

    it("should not fetch when uri is whitespace only", () => {
      const { result } = renderHook(() => useVerifyArtifact({ uri: "   " }), { wrapper });

      expect(result.current.verification).toBeUndefined();
      expect(result.current.isFetching).toBe(false);
    });

    it("should use correct query key based on uri and expectedSAN", async () => {
      const testUri = "https://example.com/image:latest";
      const expectedSAN = "test@example.com";

      const { result } = renderHook(() => useVerifyArtifact({ uri: testUri, expectedSAN }), { wrapper });

      await waitFor(
        () => {
          expect(result.current.verification).toBeDefined();
        },
        { timeout: 2000 }
      );

      // Verify the query is cached with the correct key
      const queryData = queryClient.getQueryData(ArtifactsKeys.verify(testUri, expectedSAN));
      expect(queryData).toEqual(artifactVerificationViewModelMock);
    });

    it("should use correct query key when expectedSAN is null", async () => {
      const testUri = "https://example.com/image:latest";

      const { result } = renderHook(() => useVerifyArtifact({ uri: testUri, expectedSAN: null }), { wrapper });

      await waitFor(
        () => {
          expect(result.current.verification).toBeDefined();
        },
        { timeout: 2000 }
      );

      // Verify the query is cached with the correct key
      const queryData = queryClient.getQueryData(ArtifactsKeys.verify(testUri, null));
      expect(queryData).toEqual(artifactVerificationViewModelMock);
    });

    it("should use correct query key when expectedSAN is undefined", async () => {
      const testUri = "https://example.com/image:latest";

      const { result } = renderHook(() => useVerifyArtifact({ uri: testUri }), { wrapper });

      await waitFor(
        () => {
          expect(result.current.verification).toBeDefined();
        },
        { timeout: 2000 }
      );

      // Verify the query is cached with the correct key (undefined should be treated as null)
      const queryData = queryClient.getQueryData(ArtifactsKeys.verify(testUri, null));
      expect(queryData).toEqual(artifactVerificationViewModelMock);
    });

    it("should handle refetch", async () => {
      const testUri = "https://example.com/image:latest";

      const { result } = renderHook(() => useVerifyArtifact({ uri: testUri }), { wrapper });

      await waitFor(
        () => {
          expect(result.current.verification).toBeDefined();
        },
        { timeout: 2000 }
      );

      const initialData = result.current.verification;
      expect(initialData).toEqual(artifactVerificationViewModelMock);

      // Refetch should work
      await result.current.refetch();

      await waitFor(
        () => {
          expect(result.current.verification).toBeDefined();
        },
        { timeout: 2000 }
      );

      expect(result.current.verification).toEqual(artifactVerificationViewModelMock);
    });

    it("should update query when uri changes", async () => {
      const uri1 = "https://example.com/image1:latest";
      const uri2 = "https://example.com/image2:latest";

      const { result, rerender } = renderHook(
        ({ uri }: { uri: string | null | undefined }) => useVerifyArtifact({ uri }),
        {
          wrapper,
          initialProps: { uri: uri1 },
        }
      );

      await waitFor(
        () => {
          expect(result.current.verification).toBeDefined();
        },
        { timeout: 2000 }
      );

      expect(result.current.verification).toEqual(artifactVerificationViewModelMock);

      // Change URI
      rerender({ uri: uri2 });

      await waitFor(
        () => {
          expect(result.current.verification).toBeDefined();
        },
        { timeout: 2000 }
      );

      // Should still return mock data (same mock for both URIs in test)
      expect(result.current.verification).toEqual(artifactVerificationViewModelMock);
    });

    it("should update query when expectedSAN changes", async () => {
      const testUri = "https://example.com/image:latest";
      const san1 = "test1@example.com";
      const san2 = "test2@example.com";

      const { result, rerender } = renderHook(
        ({ expectedSAN }: { expectedSAN?: string | null }) => useVerifyArtifact({ uri: testUri, expectedSAN }),
        {
          wrapper,
          initialProps: { expectedSAN: san1 },
        }
      );

      await waitFor(
        () => {
          expect(result.current.verification).toBeDefined();
        },
        { timeout: 2000 }
      );

      expect(result.current.verification).toEqual(artifactVerificationViewModelMock);

      // Change expectedSAN
      rerender({ expectedSAN: san2 });

      await waitFor(
        () => {
          expect(result.current.verification).toBeDefined();
        },
        { timeout: 2000 }
      );

      // Should still return mock data (same mock for both SANs in test)
      expect(result.current.verification).toEqual(artifactVerificationViewModelMock);
    });
  });
});

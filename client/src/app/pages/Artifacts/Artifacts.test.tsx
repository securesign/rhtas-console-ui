import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { Artifacts } from "./Artifacts";
import type { ImageMetadataResponse, VerifyArtifactResponse } from "@app/client";

// Mock DocumentMetadata since it relies on branding hook
vi.mock("@app/components/DocumentMetadata", () => ({
  DocumentMetadata: () => null,
}));

// Mock ArtifactResults to isolate page-level logic
vi.mock("./components/ArtifactResults", () => ({
  ArtifactResults: ({
    artifact,
    verification,
  }: {
    artifact: ImageMetadataResponse;
    verification: VerifyArtifactResponse;
  }) => (
    <div data-testid="artifact-results">
      {artifact.image} - {verification.summary.overallStatus}
    </div>
  ),
}));

const mockRefetchVerification = vi.fn();

// Mock query hooks
vi.mock("@app/queries/artifacts", () => ({
  useFetchArtifactsImageData: vi.fn(),
  useVerifyArtifact: vi.fn(),
}));

import { useFetchArtifactsImageData, useVerifyArtifact } from "@app/queries/artifacts";

const mockUseFetchArtifactsImageData = vi.mocked(useFetchArtifactsImageData);
const mockUseVerifyArtifact = vi.mocked(useVerifyArtifact);

const fakeArtifact: ImageMetadataResponse = {
  image: "quay.io/test/image",
  registry: "quay.io",
  digest: "sha256:abc123",
  metadata: { mediaType: "application/vnd.oci.image.manifest.v1+json", size: 1024 },
};

const fakeVerification: VerifyArtifactResponse = {
  signatures: [],
  attestations: [],
  summary: {
    overallStatus: "verified",
    identities: [],
    signatureCount: 0,
    attestationCount: 0,
    rekorEntryCount: 0,
  },
  artifact: fakeArtifact,
};

describe("Artifacts", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: idle state (no URI submitted yet)
    mockUseFetchArtifactsImageData.mockReturnValue({
      artifact: undefined,
      isFetching: false,
      fetchError: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useFetchArtifactsImageData>);

    mockUseVerifyArtifact.mockReturnValue({
      verification: undefined,
      isFetching: false,
      fetchError: null,
      refetch: mockRefetchVerification,
    } as unknown as ReturnType<typeof useVerifyArtifact>);
  });

  test("renders search input and heading", () => {
    render(<Artifacts />);

    expect(screen.getByRole("heading", { name: "Artifacts" })).toBeInTheDocument();
    expect(screen.getByLabelText("Containerimage URI input field")).toBeInTheDocument();
  });

  test("renders search input with placeholder text", () => {
    render(<Artifacts />);

    const input = screen.getByLabelText("Containerimage URI input field");
    expect(input).toHaveAttribute("placeholder", expect.stringContaining("Enter container image URI"));
  });

  test("form submission with empty input shows validation error", async () => {
    const user = userEvent.setup();
    render(<Artifacts />);

    // Submit the form by pressing Enter in the empty search
    const input = screen.getByLabelText("Containerimage URI input field");
    await user.click(input);
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText("A value is required")).toBeInTheDocument();
    });
  });

  test("form submission with valid URI triggers data fetch", async () => {
    const user = userEvent.setup();
    render(<Artifacts />);

    const input = screen.getByLabelText("Containerimage URI input field");
    await user.type(input, "quay.io/test/image");
    await user.keyboard("{Enter}");

    // The hooks should be called with the submitted URI
    await waitFor(() => {
      expect(mockUseFetchArtifactsImageData).toHaveBeenCalledWith(
        expect.objectContaining({ uri: "quay.io/test/image" })
      );
    });
  });

  test("loading spinner displayed while queries are in flight", () => {
    mockUseFetchArtifactsImageData.mockReturnValue({
      artifact: undefined,
      isFetching: true,
      fetchError: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useFetchArtifactsImageData>);

    render(<Artifacts />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("error state rendered when artifact data fetch fails", () => {
    mockUseFetchArtifactsImageData.mockReturnValue({
      artifact: undefined,
      isFetching: false,
      fetchError: new Error("Network error") as unknown as ReturnType<typeof useFetchArtifactsImageData>["fetchError"],
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useFetchArtifactsImageData>);

    render(<Artifacts />);

    // LoadingWrapper shows ErrorEmptyState on error
    expect(screen.queryByTestId("artifact-results")).not.toBeInTheDocument();
  });

  test("error state rendered when verification fetch fails", () => {
    mockUseVerifyArtifact.mockReturnValue({
      verification: undefined,
      isFetching: false,
      fetchError: new Error("Verify error") as unknown as ReturnType<typeof useVerifyArtifact>["fetchError"],
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useVerifyArtifact>);

    render(<Artifacts />);

    expect(screen.queryByTestId("artifact-results")).not.toBeInTheDocument();
  });

  test("results rendered when both queries return data successfully", () => {
    mockUseFetchArtifactsImageData.mockReturnValue({
      artifact: fakeArtifact,
      isFetching: false,
      fetchError: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useFetchArtifactsImageData>);

    mockUseVerifyArtifact.mockReturnValue({
      verification: fakeVerification,
      isFetching: false,
      fetchError: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useVerifyArtifact>);

    render(<Artifacts />);

    expect(screen.getByTestId("artifact-results")).toBeInTheDocument();
    expect(screen.getByText("quay.io/test/image - verified")).toBeInTheDocument();
  });

  test("no results shown when only artifact data returns (verification pending)", () => {
    mockUseFetchArtifactsImageData.mockReturnValue({
      artifact: fakeArtifact,
      isFetching: false,
      fetchError: null,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useFetchArtifactsImageData>);

    // verification is still undefined
    render(<Artifacts />);

    expect(screen.queryByTestId("artifact-results")).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ArtifactSummary } from "./ArtifactSummary";
import type {
  ImageMetadataResponse,
  VerifyArtifactResponse,
  ArtifactSummaryView,
} from "@app/client";

const createArtifact = (overrides: Partial<ImageMetadataResponse> = {}): ImageMetadataResponse => ({
  image: "quay.io/test/image",
  registry: "quay.io",
  digest: "sha256:abc123",
  metadata: {
    mediaType: "application/vnd.oci.image.manifest.v1+json",
    size: 1024,
    created: "2024-06-15T10:30:00Z",
    labels: { maintainer: "test-maintainer" },
  },
  ...overrides,
});

const createVerification = (summaryOverrides: Partial<ArtifactSummaryView> = {}): VerifyArtifactResponse => ({
  signatures: [],
  attestations: [],
  summary: {
    overallStatus: "verified",
    identities: [],
    signatureCount: 1,
    attestationCount: 0,
    rekorEntryCount: 1,
    ...summaryOverrides,
  },
  artifact: createArtifact(),
});

describe("ArtifactSummary", () => {
  test("renders digest, media type, size, and created fields", () => {
    const artifact = createArtifact();
    const verification = createVerification();

    render(<ArtifactSummary artifact={artifact} verification={verification} />);

    expect(screen.getByText("sha256:abc123")).toBeInTheDocument();
    expect(screen.getByText("application/vnd.oci.image.manifest.v1+json")).toBeInTheDocument();
    expect(screen.getByText("1024")).toBeInTheDocument();
  });

  test("renders identity labels when identities are present", () => {
    const verification = createVerification({
      identities: [
        { id: 1, type: "email", value: "user@example.com", source: "san" },
        { id: 2, type: "uri", value: "https://accounts.google.com", source: "issuer" },
      ],
    });

    render(<ArtifactSummary artifact={createArtifact()} verification={verification} />);

    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    expect(screen.getByText("https://accounts.google.com")).toBeInTheDocument();
  });

  test("renders 'No identity available' when identities are empty", () => {
    const verification = createVerification({ identities: [] });

    render(<ArtifactSummary artifact={createArtifact()} verification={verification} />);

    expect(screen.getByText("No identity available")).toBeInTheDocument();
  });

  test("renders signature and attestation counts", () => {
    const verification = createVerification({
      signatureCount: 3,
      attestationCount: 2,
      rekorEntryCount: 5,
    });

    render(<ArtifactSummary artifact={createArtifact()} verification={verification} />);

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("renders time coherence OK with formatted date range", () => {
    const verification = createVerification({
      timeCoherence: {
        status: "ok",
        minIntegratedTime: "2024-06-15T10:00:00Z",
        maxIntegratedTime: "2024-06-15T12:00:00Z",
      },
    });

    render(<ArtifactSummary artifact={createArtifact()} verification={verification} />);

    expect(screen.getByText(/^OK \(/)).toBeInTheDocument();
  });

  test("renders popover text for unknown time coherence", () => {
    const verification = createVerification({
      timeCoherence: {
        status: "unknown",
      },
    });

    render(<ArtifactSummary artifact={createArtifact()} verification={verification} />);

    expect(screen.getByText("unknown")).toBeInTheDocument();
  });

  test("renders time coherence status directly for warning/error", () => {
    const verification = createVerification({
      timeCoherence: {
        status: "warning",
      },
    });

    render(<ArtifactSummary artifact={createArtifact()} verification={verification} />);

    expect(screen.getByText("warning")).toBeInTheDocument();
  });

  test("does not render time coherence section when absent", () => {
    const verification = createVerification({ timeCoherence: undefined });

    render(<ArtifactSummary artifact={createArtifact()} verification={verification} />);

    expect(screen.queryByText("Time Coherence")).not.toBeInTheDocument();
  });

  test("renders help text buttons for description fields", () => {
    const verification = createVerification();

    render(<ArtifactSummary artifact={createArtifact()} verification={verification} />);

    expect(screen.getByText("Digest")).toBeInTheDocument();
    expect(screen.getByText("Media Type")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Size/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Created/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Signatures/i })).toBeInTheDocument();
  });

  test("renders maintainer label", () => {
    const artifact = createArtifact({
      metadata: {
        mediaType: "application/vnd.oci.image.manifest.v1+json",
        size: 1024,
        labels: { maintainer: "my-team@corp.com" },
      },
    });
    const verification = createVerification();

    render(<ArtifactSummary artifact={artifact} verification={verification} />);

    expect(screen.getByText("my-team@corp.com")).toBeInTheDocument();
  });
});

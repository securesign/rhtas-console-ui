import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { ArtifactCard } from "./ArtifactCard";
import type { ImageMetadataResponse, VerifyArtifactResponse } from "@app/client";

// Mock child components to isolate
vi.mock("./ArtifactSummary", () => ({
  ArtifactSummary: () => <div data-testid="artifact-summary" />,
}));

vi.mock("./ArtifactSignatures", () => ({
  ArtifactSignatures: () => <div data-testid="artifact-signatures" />,
}));

vi.mock("./ArtifactAttestations", () => ({
  ArtifactAttestations: () => <div data-testid="artifact-attestations" />,
}));

const createArtifact = (overrides: Partial<ImageMetadataResponse> = {}): ImageMetadataResponse => ({
  image: "quay.io/test/image",
  registry: "quay.io",
  digest: "sha256:abc123",
  metadata: { mediaType: "application/vnd.oci.image.manifest.v1+json", size: 1024 },
  ...overrides,
});

const createVerification = (overrides: Partial<VerifyArtifactResponse> = {}): VerifyArtifactResponse => ({
  signatures: [
    {
      id: 1,
      digest: "sha256:sig1",
      signingCertificate: {
        subject: "",
        isCa: false,
        issuer: "",
        notBefore: "",
        notAfter: "",
        pem: "",
        role: "leaf",
        serialNumber: "",
        sans: [],
      },
      certificateChain: [],
      rawBundleJson: "{}",
      timestamp: "2024-06-15T10:30:00Z",
      signatureStatus: { signature: "verified", chain: "verified", rekor: "verified" },
    },
  ],
  attestations: [
    {
      id: 1,
      digest: "sha256:att1",
      type: "intoto",
      rawBundleJson: "{}",
      rawStatementJson: "{}",
      predicateType: "https://slsa.dev/provenance/v1",
      timestamp: "2024-06-15T10:30:00Z",
      attestationStatus: { attestation: "verified", chain: "verified", rekor: "verified" },
    },
  ],
  summary: {
    overallStatus: "verified",
    identities: [],
    signatureCount: 1,
    attestationCount: 1,
    rekorEntryCount: 1,
  },
  artifact: createArtifact(),
  ...overrides,
});

describe("ArtifactCard", () => {
  test("renders external link to registry with correct href", () => {
    const artifact = createArtifact({ image: "quay.io/myorg/myapp" });
    const verification = createVerification();

    render(<ArtifactCard artifact={artifact} verification={verification} />);

    const link = screen.getByRole("link", { name: "quay.io/myorg/myapp" });
    expect(link).toHaveAttribute("href", "https://quay.io/myorg/myapp");
    expect(link).toHaveAttribute("target", "_blank");
  });

  test("renders verification status label with green for verified", () => {
    const verification = createVerification({
      summary: {
        overallStatus: "verified",
        identities: [],
        signatureCount: 1,
        attestationCount: 1,
        rekorEntryCount: 1,
      },
    });

    render(<ArtifactCard artifact={createArtifact()} verification={verification} />);

    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  test("renders verification status label with red for failed", () => {
    const verification = createVerification({
      summary: {
        overallStatus: "failed",
        identities: [],
        signatureCount: 0,
        attestationCount: 0,
        rekorEntryCount: 0,
      },
    });

    render(<ArtifactCard artifact={createArtifact()} verification={verification} />);

    expect(screen.getByText("Verification failed")).toBeInTheDocument();
  });

  test("renders verification status label for unsigned", () => {
    const verification = createVerification({
      summary: {
        overallStatus: "unsigned",
        identities: [],
        signatureCount: 0,
        attestationCount: 0,
        rekorEntryCount: 0,
      },
    });

    render(<ArtifactCard artifact={createArtifact()} verification={verification} />);

    expect(screen.getByText("Not signed")).toBeInTheDocument();
  });

  test("ArtifactSummary section is always rendered", () => {
    render(<ArtifactCard artifact={createArtifact()} verification={createVerification()} />);

    expect(screen.getByTestId("artifact-summary")).toBeInTheDocument();
  });

  test("signatures section shows count in header", () => {
    const verification = createVerification({
      signatures: [
        {
          id: 1,
          digest: "sha256:a",
          signingCertificate: {
            subject: "",
            isCa: false,
            issuer: "",
            notBefore: "",
            notAfter: "",
            pem: "",
            role: "leaf",
            serialNumber: "",
            sans: [],
          },
          certificateChain: [],
          rawBundleJson: "{}",
          signatureStatus: { signature: "verified", chain: "verified", rekor: "verified" },
        },
        {
          id: 2,
          digest: "sha256:b",
          signingCertificate: {
            subject: "",
            isCa: false,
            issuer: "",
            notBefore: "",
            notAfter: "",
            pem: "",
            role: "leaf",
            serialNumber: "",
            sans: [],
          },
          certificateChain: [],
          rawBundleJson: "{}",
          signatureStatus: { signature: "verified", chain: "verified", rekor: "verified" },
        },
      ],
    });

    render(<ArtifactCard artifact={createArtifact()} verification={verification} />);

    expect(screen.getByText("Signatures - 2")).toBeInTheDocument();
  });

  test("signatures section expand/collapse toggle works", async () => {
    const user = userEvent.setup();
    render(<ArtifactCard artifact={createArtifact()} verification={createVerification()} />);

    // Find the signatures card header toggle
    const signaturesHeading = screen.getByText("Signatures - 1");
    const signaturesCard = signaturesHeading.closest(".pf-v6-c-card")!;
    const toggleButton = signaturesCard.querySelector(".pf-v6-c-card__header-toggle button")!;

    await user.click(toggleButton);

    expect(screen.getByTestId("artifact-signatures")).toBeVisible();
  });

  test("attestations section expand/collapse toggle works", async () => {
    const user = userEvent.setup();
    render(<ArtifactCard artifact={createArtifact()} verification={createVerification()} />);

    const attestationsHeading = screen.getByText("Attestations - 1");
    const attestationsCard = attestationsHeading.closest(".pf-v6-c-card")!;
    const toggleButton = attestationsCard.querySelector(".pf-v6-c-card__header-toggle button")!;

    await user.click(toggleButton);

    expect(screen.getByTestId("artifact-attestations")).toBeVisible();
  });

  test("empty state rendered when signatures array is empty", async () => {
    const user = userEvent.setup();
    const verification = createVerification({
      signatures: undefined as unknown as VerifyArtifactResponse["signatures"],
    });

    render(<ArtifactCard artifact={createArtifact()} verification={verification} />);

    // Expand signatures
    const signaturesHeading = screen.getByText("Signatures - 0");
    const signaturesCard = signaturesHeading.closest(".pf-v6-c-card")!;
    const toggleButton = signaturesCard.querySelector(".pf-v6-c-card__header-toggle button")!;
    await user.click(toggleButton);

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  test("empty state rendered when attestations array is empty", async () => {
    const user = userEvent.setup();
    const verification = createVerification({
      attestations: undefined as unknown as VerifyArtifactResponse["attestations"],
    });

    render(<ArtifactCard artifact={createArtifact()} verification={verification} />);

    // Expand attestations
    const attestationsHeading = screen.getByText("Attestations - 0");
    const attestationsCard = attestationsHeading.closest(".pf-v6-c-card")!;
    const toggleButton = attestationsCard.querySelector(".pf-v6-c-card__header-toggle button")!;
    await user.click(toggleButton);

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  test("renders Artifact details title", () => {
    render(<ArtifactCard artifact={createArtifact()} verification={createVerification()} />);

    expect(screen.getByText("Artifact details")).toBeInTheDocument();
  });
});

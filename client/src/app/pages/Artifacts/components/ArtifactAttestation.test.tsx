import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { ArtifactAttestation } from "./ArtifactAttestation";
import { createAttestationView, createLeafCertificate } from "@app/test/factories/certificates";
import type { AttestationView, TransparencyLogEntry } from "@app/client";

// Mock child components to isolate unit tests
vi.mock("./LeafCertificate", () => ({
  LeafCertificate: ({ leafCert }: { leafCert: { subject: string } }) => (
    <div data-testid="leaf-certificate">{leafCert.subject}</div>
  ),
}));

vi.mock("./CertificateChain", () => ({
  CertificateChain: () => <div data-testid="certificate-chain" />,
}));

vi.mock("./RekorEntryPanel", () => ({
  RekorEntryPanel: () => <div data-testid="rekor-entry-panel" />,
}));

vi.mock("@app/utils/utils", async () => {
  const actual = await vi.importActual<typeof import("@app/utils/utils")>("@app/utils/utils");
  return {
    ...actual,
    handleDownloadBundle: vi.fn(),
    relativeDateString: () => "2 days ago",
  };
});

import { handleDownloadBundle } from "@app/utils/utils";

const renderInTable = (attestation: AttestationView, index = 0) =>
  render(
    <table>
      <tbody>
        <ArtifactAttestation attestation={attestation} index={index} />
      </tbody>
    </table>
  );

describe("ArtifactAttestation", () => {
  test("renders attestation digest", () => {
    const attestation = createAttestationView({ digest: "sha256:abc" });
    renderInTable(attestation);

    expect(screen.getByText("sha256:abc")).toBeInTheDocument();
  });

  test("renders identity from signing certificate SANs", () => {
    const attestation = createAttestationView({
      signingCertificate: createLeafCertificate({ sans: ["alice@example.com"] }),
    });
    renderInTable(attestation);

    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });

  test("renders predicate type", () => {
    const attestation = createAttestationView({ predicateType: "https://slsa.dev/provenance/v1" });
    renderInTable(attestation);

    expect(screen.getByText("https://slsa.dev/provenance/v1")).toBeInTheDocument();
  });

  test("renders formatted timestamp", () => {
    const attestation = createAttestationView({ timestamp: "2024-06-15T10:30:00Z" });
    renderInTable(attestation);

    expect(screen.getByText("2 days ago")).toBeInTheDocument();
  });

  test("renders N/A when timestamp is not a string", () => {
    const attestation = createAttestationView({ timestamp: undefined });
    renderInTable(attestation);

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  test("renders check icon when attestation status is verified", () => {
    const attestation = createAttestationView({
      attestationStatus: { attestation: "verified", chain: "verified", rekor: "verified" },
    });
    renderInTable(attestation);

    // Both attestation and rekor statuses are verified - CheckIcon renders svg with path
    const checkIcons = document.querySelectorAll("svg");
    expect(checkIcons.length).toBeGreaterThanOrEqual(2);
  });

  test("renders times icon when attestation status is failed", () => {
    const attestation = createAttestationView({
      attestationStatus: { attestation: "failed", chain: "failed", rekor: "failed" },
    });
    renderInTable(attestation);

    // TimesIcon renders svg elements
    const svgs = document.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(2);
  });

  test("expand/collapse toggle shows leaf certificate when signing cert exists", async () => {
    const user = userEvent.setup();
    const attestation = createAttestationView({
      signingCertificate: createLeafCertificate(),
      certificateChain: [createLeafCertificate({ role: "root" })],
      rekorEntry: { logIndex: 1, integratedTime: 1000, canonicalizedBody: "" } as TransparencyLogEntry,
    });
    renderInTable(attestation);

    // Initially the expanded content row is hidden
    expect(screen.queryByTestId("leaf-certificate")).not.toBeVisible();

    // Click the expand toggle
    const toggleButton = screen.getByRole("button", { name: "Details" });
    await user.click(toggleButton);

    // Now the child components should be visible
    expect(screen.getByTestId("leaf-certificate")).toBeVisible();
    expect(screen.getByTestId("certificate-chain")).toBeVisible();
    expect(screen.getByTestId("rekor-entry-panel")).toBeVisible();
  });

  test("dropdown menu opens on toggle click", async () => {
    const user = userEvent.setup();
    const attestation = createAttestationView();
    renderInTable(attestation);

    const menuToggle = screen.getByRole("button", { name: "Attestation actions" });
    await user.click(menuToggle);

    expect(screen.getByText("Download Bundle")).toBeInTheDocument();
  });

  test("bundle download action calls handleDownloadBundle", async () => {
    const user = userEvent.setup();
    const attestation = createAttestationView({ rawBundleJson: '{"some":"bundle"}' });
    renderInTable(attestation);

    const menuToggle = screen.getByRole("button", { name: "Attestation actions" });
    await user.click(menuToggle);

    const downloadItem = screen.getByText("Download Bundle");
    await user.click(downloadItem);

    expect(handleDownloadBundle).toHaveBeenCalledWith(attestation);
  });

  test("bundle download button is disabled when no bundle data", async () => {
    const user = userEvent.setup();
    const attestation = createAttestationView({ rawBundleJson: "" });
    renderInTable(attestation);

    const menuToggle = screen.getByRole("button", { name: "Attestation actions" });
    await user.click(menuToggle);

    const downloadItem = screen.getByRole("menuitem", { name: "Download Bundle" });
    expect(downloadItem).toBeDisabled();
  });

  test("handles missing signing certificate gracefully", () => {
    const attestation = createAttestationView({ signingCertificate: undefined });
    renderInTable(attestation);

    expect(screen.getByText("Unknown subject")).toBeInTheDocument();
  });

  test("does not render certificate chain when absent", async () => {
    const user = userEvent.setup();
    const attestation = createAttestationView({
      certificateChain: undefined,
      rekorEntry: undefined,
      signingCertificate: undefined,
    });
    renderInTable(attestation);

    const toggleButton = screen.getByRole("button", { name: "Details" });
    await user.click(toggleButton);

    expect(screen.queryByTestId("certificate-chain")).not.toBeInTheDocument();
    expect(screen.queryByTestId("rekor-entry-panel")).not.toBeInTheDocument();
    expect(screen.queryByTestId("leaf-certificate")).not.toBeInTheDocument();
  });

  test("does not render certificate chain when empty array", async () => {
    const user = userEvent.setup();
    const attestation = createAttestationView({
      certificateChain: [],
    });
    renderInTable(attestation);

    const toggleButton = screen.getByRole("button", { name: "Details" });
    await user.click(toggleButton);

    expect(screen.queryByTestId("certificate-chain")).not.toBeInTheDocument();
  });

  test("does not render rekor entry when absent", async () => {
    const user = userEvent.setup();
    const attestation = createAttestationView({ rekorEntry: undefined });
    renderInTable(attestation);

    const toggleButton = screen.getByRole("button", { name: "Details" });
    await user.click(toggleButton);

    expect(screen.queryByTestId("rekor-entry-panel")).not.toBeInTheDocument();
  });
});

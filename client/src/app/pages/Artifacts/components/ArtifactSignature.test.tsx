import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { ArtifactSignature } from "./ArtifactSignature";
import { createSignatureView, createLeafCertificate } from "@app/test/factories/certificates";
import type { SignatureView, TransparencyLogEntry } from "@app/client";

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
    relativeDateString: () => "3 days ago",
  };
});

import { handleDownloadBundle } from "@app/utils/utils";

const renderInTable = (signature: SignatureView, index = 0) =>
  render(
    <table>
      <tbody>
        <ArtifactSignature signature={signature} index={index} />
      </tbody>
    </table>
  );

describe("ArtifactSignature", () => {
  test("renders signature digest", () => {
    const signature = createSignatureView({ digest: "sha256:abc" });
    renderInTable(signature);

    expect(screen.getByText("sha256:abc")).toBeInTheDocument();
  });

  test("renders identity via toIdentity()", () => {
    const signature = createSignatureView({
      signingCertificate: createLeafCertificate({ sans: ["alice@example.com"] }),
    });
    renderInTable(signature);

    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });

  test("renders formatted timestamp", () => {
    const signature = createSignatureView({ timestamp: "2024-06-15T10:30:00Z" });
    renderInTable(signature);

    expect(screen.getByText("3 days ago")).toBeInTheDocument();
  });

  test("renders N/A when timestamp is not a string", () => {
    const signature = createSignatureView({ timestamp: undefined });
    renderInTable(signature);

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  test("renders three verification status badges", () => {
    const signature = createSignatureView({
      signatureStatus: { signature: "verified", chain: "verified", rekor: "verified" },
    });
    renderInTable(signature);

    // Three CheckIcon SVGs for signature, chain, and rekor statuses
    const svgs = document.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(3);
  });

  test("renders times icons when statuses are failed", () => {
    const signature = createSignatureView({
      signatureStatus: { signature: "failed", chain: "failed", rekor: "failed" },
    });
    renderInTable(signature);

    const svgs = document.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(3);
  });

  test("expand/collapse toggle reveals certificate details", async () => {
    const user = userEvent.setup();
    const signature = createSignatureView({
      signingCertificate: createLeafCertificate(),
      certificateChain: [createLeafCertificate({ role: "root" })],
      rekorEntry: { logIndex: 1, integratedTime: 1000, canonicalizedBody: "" } as TransparencyLogEntry,
    });
    renderInTable(signature);

    // Click the expand toggle (PF renders it with aria-label="Details")
    const toggleButton = screen.getByRole("button", { name: "Details" });
    await user.click(toggleButton);

    expect(screen.getByTestId("leaf-certificate")).toBeInTheDocument();
    expect(screen.getByTestId("certificate-chain")).toBeInTheDocument();
    expect(screen.getByTestId("rekor-entry-panel")).toBeInTheDocument();
  });

  test("dropdown menu toggle opens/closes", async () => {
    const user = userEvent.setup();
    const signature = createSignatureView();
    renderInTable(signature);

    const menuToggle = screen.getByRole("button", { name: "Signature actions" });
    await user.click(menuToggle);

    expect(screen.getByText("Download bundle")).toBeInTheDocument();
  });

  test("bundle download action triggers correctly", async () => {
    const user = userEvent.setup();
    const signature = createSignatureView({ rawBundleJson: '{"some":"bundle"}' });
    renderInTable(signature);

    const menuToggle = screen.getByRole("button", { name: "Signature actions" });
    await user.click(menuToggle);

    const downloadItem = screen.getByText("Download bundle");
    await user.click(downloadItem);

    expect(handleDownloadBundle).toHaveBeenCalledWith(signature);
  });

  test("bundle download button disabled when no bundle data", async () => {
    const user = userEvent.setup();
    const signature = createSignatureView({ rawBundleJson: "" });
    renderInTable(signature);

    const menuToggle = screen.getByRole("button", { name: "Signature actions" });
    await user.click(menuToggle);

    const downloadItem = screen.getByRole("menuitem", { name: "Download bundle" });
    expect(downloadItem).toBeDisabled();
  });

  test("handles null certificate (no identity shown)", () => {
    const signature = createSignatureView({
      signingCertificate: undefined as unknown as SignatureView["signingCertificate"],
    });
    renderInTable(signature);

    expect(screen.getByText("Unknown identity")).toBeInTheDocument();
  });

  test("does not render leaf certificate when signing cert absent", async () => {
    const user = userEvent.setup();
    const signature = createSignatureView({
      signingCertificate: undefined as unknown as SignatureView["signingCertificate"],
      certificateChain: [],
      rekorEntry: undefined,
    });
    renderInTable(signature);

    const toggleButton = screen.getByRole("button", { name: "Details" });
    await user.click(toggleButton);

    expect(screen.queryByTestId("leaf-certificate")).not.toBeInTheDocument();
  });

  test("does not render certificate chain when empty", async () => {
    const user = userEvent.setup();
    const signature = createSignatureView({ certificateChain: [] });
    renderInTable(signature);

    const toggleButton = screen.getByRole("button", { name: "Details" });
    await user.click(toggleButton);

    expect(screen.queryByTestId("certificate-chain")).not.toBeInTheDocument();
  });

  test("does not render rekor entry when absent", async () => {
    const user = userEvent.setup();
    const signature = createSignatureView({ rekorEntry: undefined });
    renderInTable(signature);

    const toggleButton = screen.getByRole("button", { name: "Details" });
    await user.click(toggleButton);

    expect(screen.queryByTestId("rekor-entry-panel")).not.toBeInTheDocument();
  });
});

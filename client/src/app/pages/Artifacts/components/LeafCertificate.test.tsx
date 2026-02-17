import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { LeafCertificate } from "./LeafCertificate";
import { createLeafCertificate } from "@app/test/factories/certificates";

// mock the util functions so the component's async fingerprint side-effects
// are deterministic in unit tests
vi.mock("@app/utils/utils", async () => {
  const actual = await vi.importActual<typeof import("@app/utils/utils")>("@app/utils/utils");
  return {
    ...actual,
    // keep date formatting stable so we can assert on the UI
    formatDate: (value: string) => `FMT(${value})`,
    // control the async fingerprint
    sha256FingerprintFromPem: vi.fn().mockResolvedValue("fp:sha256:TEST"),
  };
});

import { sha256FingerprintFromPem } from "@app/utils/utils";

describe("LeafCertificate", () => {
  test("renders heading", () => {
    const leafCert = createLeafCertificate();
    render(<LeafCertificate leafCert={leafCert} />);

    expect(screen.getByText("Leaf Certificate")).toBeInTheDocument();
  });

  test("renders issuer, validity and serial when present", () => {
    const leafCert = createLeafCertificate({
      issuer: "CN=Fulcio Root CA",
      notBefore: "2024-01-01T00:00:00Z",
      notAfter: "2025-01-01T00:00:00Z",
      serialNumber: "123456789",
    });

    render(<LeafCertificate leafCert={leafCert} />);

    expect(screen.getByText("Issuer")).toBeInTheDocument();
    expect(screen.getByText("CN=Fulcio Root CA")).toBeInTheDocument();

    expect(screen.getByText("Validity")).toBeInTheDocument();
    expect(screen.getByText("FMT(2024-01-01T00:00:00Z) → FMT(2025-01-01T00:00:00Z)")).toBeInTheDocument();

    expect(screen.getByText("Serial")).toBeInTheDocument();
    expect(screen.getByText("123456789")).toBeInTheDocument();
  });

  test("renders SAN list when sans is non-empty", () => {
    const leafCert = createLeafCertificate({
      sans: ["alice@example.com", "spiffe://example.com/workload"],
    });

    render(<LeafCertificate leafCert={leafCert} />);

    expect(screen.getByText("SAN")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com, spiffe://example.com/workload")).toBeInTheDocument();
  });

  test("shows fingerprint placeholder then resolves it when pem is present", async () => {
    const leafCert = createLeafCertificate({ pem: "-----BEGIN CERTIFICATE-----\nTEST\n-----END CERTIFICATE-----" });

    render(<LeafCertificate leafCert={leafCert} />);

    // fingerprint label exists when pem exists
    expect(screen.getByText("Fingerprint")).toBeInTheDocument();

    // placeholder while the async sha runs
    expect(screen.getByText("...")).toBeInTheDocument();

    // then the mocked fingerprint appears
    expect(await screen.findByText("fp:sha256:TEST")).toBeInTheDocument();

    expect(sha256FingerprintFromPem).toHaveBeenCalledTimes(1);
    expect(sha256FingerprintFromPem).toHaveBeenCalledWith(leafCert.pem);
  });

  test("copy PEM action copies pem and shows a success alert", async () => {
    const user = userEvent.setup();
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockWriteText },
      writable: true,
    });

    const leafCert = createLeafCertificate({
      pem: "-----BEGIN CERTIFICATE-----\nPEM\n-----END CERTIFICATE-----",
    });

    render(<LeafCertificate leafCert={leafCert} />);

    // open the actions dropdown
    const toggle = screen.getByRole("button", { name: "Leaf certificate actions toggle" });
    await user.click(toggle);

    // click "Copy PEM"
    const menuItem = await screen.findByRole("menuitem", { name: "Copy PEM" });
    await user.click(menuItem);

    expect(mockWriteText).toHaveBeenCalledTimes(1);
    expect(mockWriteText).toHaveBeenCalledWith(leafCert.pem);

    const alertTitle = await screen.findByText("Copied PEM to clipboard");
    const alertContainer = alertTitle.closest(".pf-v6-c-alert");
    expect(alertContainer).toBeTruthy();

    // click the close button
    const closeButton = within(alertContainer as HTMLElement).getByRole("button");
    await user.click(closeButton);

    // manually simulate PF's transition end
    const alertGroupItem = alertContainer!.closest(".pf-v6-c-alert-group__item");
    if (alertGroupItem) {
      fireEvent.transitionEnd(alertGroupItem);
    }

    await waitFor(() => {
      expect(screen.queryByText("Copied PEM to clipboard")).not.toBeInTheDocument();
    });
  });

  test("copy PEM action shows error alert when clipboard fails", async () => {
    const user = userEvent.setup();
    const mockWriteText = vi.fn().mockRejectedValue(new Error("Clipboard blocked"));
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockWriteText },
      writable: true,
    });

    const leafCert = createLeafCertificate({
      pem: "-----BEGIN CERTIFICATE-----\nPEM\n-----END CERTIFICATE-----",
    });

    render(<LeafCertificate leafCert={leafCert} />);

    // open the actions dropdown
    const toggle = screen.getByRole("button", { name: "Leaf certificate actions toggle" });
    await user.click(toggle);

    // click "Copy PEM"
    const menuItem = await screen.findByRole("menuitem", { name: "Copy PEM" });
    await user.click(menuItem);

    expect(mockWriteText).toHaveBeenCalledTimes(1);

    // should show error alert, not success
    const alertTitle = await screen.findByText("Failed to copy to clipboard");
    const alertContainer = alertTitle.closest(".pf-v6-c-alert");
    expect(alertContainer).toBeTruthy();
    expect(alertContainer).toHaveClass("pf-m-danger");
  });
});

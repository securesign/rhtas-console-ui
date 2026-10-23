import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CertificateStatusIcon } from "./CertificateStatusIcon";

// Stub the PatternFly icons so each one is identifiable in the DOM. The real
// icons render as anonymous <svg> elements, which cannot be told apart.
vi.mock("@patternfly/react-icons", () => ({
  BanIcon: () => <span data-testid="icon-ban" />,
  CheckCircleIcon: () => <span data-testid="icon-check-circle" />,
  MinusIcon: () => <span data-testid="icon-minus" />,
  PendingIcon: () => <span data-testid="icon-pending" />,
  TimesCircleIcon: () => <span data-testid="icon-times-circle" />,
  WarningTriangleIcon: () => <span data-testid="icon-warning-triangle" />,
}));

describe("CertificateStatusIcon", () => {
  it("renders the pending icon with info status for a pending certificate", () => {
    const { container } = render(<CertificateStatusIcon status="pending" />);

    expect(screen.getByTestId("icon-pending")).toBeInTheDocument();
    expect(container.querySelector(".pf-m-info")).toBeInTheDocument();
  });

  it("is case-insensitive for the pending status", () => {
    render(<CertificateStatusIcon status="PENDING" />);

    expect(screen.getByTestId("icon-pending")).toBeInTheDocument();
  });

  it("renders the success icon for an active certificate", () => {
    const { container } = render(<CertificateStatusIcon status="active" />);

    expect(screen.getByTestId("icon-check-circle")).toBeInTheDocument();
    expect(container.querySelector(".pf-m-success")).toBeInTheDocument();
  });

  it("renders the danger icon for an expired certificate", () => {
    const { container } = render(<CertificateStatusIcon status="expired" />);

    expect(screen.getByTestId("icon-times-circle")).toBeInTheDocument();
    expect(container.querySelector(".pf-m-danger")).toBeInTheDocument();
  });

  it("falls back to the minus icon for an unknown status", () => {
    render(<CertificateStatusIcon status="something-else" />);

    expect(screen.getByTestId("icon-minus")).toBeInTheDocument();
  });
});

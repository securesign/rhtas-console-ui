import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { SystemHealth } from "./SystemHealth";
import type { SystemHealthResponse } from "@app/client";

vi.mock("@app/components/DocumentMetadata", () => ({
  DocumentMetadata: () => null,
}));

vi.mock("./components/PipelineStatusBanner", () => ({
  PipelineStatusBanner: () => <div data-testid="pipeline-banner" />,
}));

vi.mock("./components/ServiceStatusCard", () => ({
  ServiceStatusCard: ({ name, status }: { name: string; status: string }) => (
    <div data-testid={`service-card-${name}`}>{status}</div>
  ),
}));

vi.mock("./components/ExpiringTrustAssets", () => ({
  ExpiringTrustAssets: () => <div data-testid="expiring-assets" />,
}));

vi.mock("./components/ErrorRateCard", () => ({
  ErrorRateCard: () => <div data-testid="error-rate" />,
}));

vi.mock("./components/IncidentTimeline", () => ({
  IncidentTimeline: () => <div data-testid="incident-timeline" />,
}));

const mockRefetch = vi.fn();

vi.mock("@app/queries/system-health", () => ({
  useFetchSystemHealth: vi.fn(),
}));

import { useFetchSystemHealth } from "@app/queries/system-health";
const mockUseFetchSystemHealth = vi.mocked(useFetchSystemHealth);

const healthyResponse: SystemHealthResponse = {
  sigstoreServices: "healthy",
  rekorStatus: "healthy",
  tufStatus: "healthy",
  updatedAt: "2026-06-30T09:18:32.658987Z",
};

const degradedResponse: SystemHealthResponse = {
  sigstoreServices: "healthy",
  rekorStatus: "unhealthy",
  tufStatus: "healthy",
  updatedAt: "2026-06-30T09:18:32.658987Z",
};

const downResponse: SystemHealthResponse = {
  sigstoreServices: "unhealthy",
  rekorStatus: "unhealthy",
  tufStatus: "unhealthy",
  updatedAt: "2026-06-30T09:18:32.658987Z",
};

describe("SystemHealth", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseFetchSystemHealth.mockReturnValue({
      data: healthyResponse,
      isFetching: false,
      fetchError: null,
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof useFetchSystemHealth>);
  });

  test("renders page heading", () => {
    render(<SystemHealth />);
    expect(screen.getByRole("heading", { name: "System Health" })).toBeInTheDocument();
  });

  test("displays Operational status when all services are healthy", () => {
    render(<SystemHealth />);
    expect(screen.getByText("Operational")).toBeInTheDocument();
  });

  test("displays Degraded status when services have mixed statuses", () => {
    mockUseFetchSystemHealth.mockReturnValue({
      data: degradedResponse,
      isFetching: false,
      fetchError: null,
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof useFetchSystemHealth>);

    render(<SystemHealth />);
    expect(screen.getByText("Degraded")).toBeInTheDocument();
  });

  test("displays Down status when all services are unhealthy", () => {
    mockUseFetchSystemHealth.mockReturnValue({
      data: downResponse,
      isFetching: false,
      fetchError: null,
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof useFetchSystemHealth>);

    render(<SystemHealth />);
    expect(screen.getByText("Down")).toBeInTheDocument();
  });

  test("displays last checked timestamp", () => {
    render(<SystemHealth />);
    expect(screen.getByText(/Last checked/)).toBeInTheDocument();
  });

  test("refresh button calls refetch", async () => {
    const user = userEvent.setup();
    render(<SystemHealth />);

    const refreshButton = screen.getByRole("button", { name: /Refresh/i });
    await user.click(refreshButton);

    expect(mockRefetch).toHaveBeenCalledOnce();
  });

  test("renders service status cards", () => {
    render(<SystemHealth />);

    expect(screen.getByTestId("service-card-Fulcio")).toBeInTheDocument();
    expect(screen.getByTestId("service-card-Rekor")).toBeInTheDocument();
    expect(screen.getByTestId("service-card-TUF")).toBeInTheDocument();
  });

  test("renders dashboard sub-components", () => {
    render(<SystemHealth />);

    expect(screen.getByTestId("pipeline-banner")).toBeInTheDocument();
    expect(screen.getByTestId("expiring-assets")).toBeInTheDocument();
    expect(screen.getByTestId("error-rate")).toBeInTheDocument();
    expect(screen.getByTestId("incident-timeline")).toBeInTheDocument();
  });

  test("loading state shown while fetching", () => {
    mockUseFetchSystemHealth.mockReturnValue({
      data: undefined,
      isFetching: true,
      fetchError: null,
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof useFetchSystemHealth>);

    render(<SystemHealth />);

    expect(screen.queryByText("Operational")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Refresh/i })).not.toBeInTheDocument();
  });
});

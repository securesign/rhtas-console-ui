import { useLocation, useNavigate, type Path } from "react-router-dom";
import { useFetchRekorSearch } from "@app/queries/rekor-search";
import { TimeoutError } from "../../shared/utils/rekor/api/rekor-api";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}));

vi.mock("@app/queries/rekor-search", () => ({
  useFetchRekorSearch: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();

  (useLocation as Mock).mockImplementation(
    (): Path => ({
      pathname: "/",
      search: "",
      hash: "",
    })
  );

  (useFetchRekorSearch as Mock).mockReturnValue({
    data: undefined,
    error: null,
    isLoading: false,
    failureCount: 0,
    refetch: vi.fn(),
  });
});

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Mock } from "vitest";
import { Explorer } from "./Explorer";
import { RekorClientProvider } from "../../shared/utils/rekor/api/context";

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <RekorClientProvider>{ui}</RekorClientProvider>
    </QueryClientProvider>
  );
}

describe("Explorer", () => {
  it("renders without issues", () => {
    renderWithProviders(<Explorer />);

    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("should render search form and display search button", () => {
    renderWithProviders(<Explorer />);

    // Form now has single "Search" field
    expect(screen.getByRole("textbox", { name: "Search input field" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("should handle invalid logIndex query parameter", () => {
    const mockNavigate = vi.fn();

    (useNavigate as Mock).mockImplementation(() => mockNavigate);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("displays loading indicator when fetching data", async () => {
    renderWithProviders(<Explorer />);

    const button = screen.getByText("Search");
    fireEvent.click(button);

    await waitFor(() => expect(screen.queryByRole("status")).toBeNull());

    expect(
      screen.findByLabelText("Showing").then((res) => {
        expect(res).toBeInTheDocument();
      })
    );
  });

  it("shows friendly message for timeout errors", () => {
    (useFetchRekorSearch as Mock).mockReturnValue({
      data: undefined,
      error: new TimeoutError(),
      isLoading: false,
      failureCount: 0,
      refetch: vi.fn(),
    });

    renderWithProviders(<Explorer />);

    expect(screen.getByText("Could not reach the Rekor server")).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("calls refetch when retry button is clicked", () => {
    const refetch = vi.fn();
    (useFetchRekorSearch as Mock).mockReturnValue({
      data: undefined,
      error: new TimeoutError(),
      isLoading: false,
      failureCount: 0,
      refetch,
    });

    renderWithProviders(<Explorer />);
    fireEvent.click(screen.getByText("Retry"));

    expect(refetch).toHaveBeenCalled();
  });

  it("shows 'still trying' text when loading with failures", () => {
    (useFetchRekorSearch as Mock).mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
      failureCount: 1,
      refetch: vi.fn(),
    });

    renderWithProviders(<Explorer />);

    expect(screen.getByText("Still trying to reach Rekor server...")).toBeInTheDocument();
  });

  it("does not show 'still trying' text on initial loading", () => {
    (useFetchRekorSearch as Mock).mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
      failureCount: 0,
      refetch: vi.fn(),
    });

    renderWithProviders(<Explorer />);

    expect(screen.queryByText("Still trying to reach Rekor server...")).not.toBeInTheDocument();
  });
});

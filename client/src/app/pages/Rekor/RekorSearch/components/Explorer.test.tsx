import { useLocation, useNavigate, type Path } from "react-router-dom";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
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
});

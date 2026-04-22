import { useLocation, useNavigate, type Path } from "react-router-dom";
import { useFetchRekorSearch } from "@app/queries/rekor-search";
import { ApiError } from "rekor";

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
      pathname: "/rekor-search",
      search: "",
      hash: "",
    })
  );

  (useNavigate as Mock).mockReturnValue(vi.fn());

  (useFetchRekorSearch as Mock).mockReturnValue({
    data: undefined,
    error: null,
    isLoading: false,
    failureCount: 0,
    refetch: vi.fn(),
  });
});

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  it("renders search form with input and button", () => {
    renderWithProviders(<Explorer />);

    expect(screen.getByRole("textbox", { name: "Search input field" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("displays loading indicator when fetching data", () => {
    (useFetchRekorSearch as Mock).mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
      failureCount: 0,
      refetch: vi.fn(),
    });

    renderWithProviders(<Explorer />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  describe("SearchError", () => {
    it("shows friendly message for network errors", () => {
      (useFetchRekorSearch as Mock).mockReturnValue({
        data: undefined,
        error: new TypeError("Failed to fetch"),
        isLoading: false,
        failureCount: 0,
        refetch: vi.fn(),
      });

      renderWithProviders(<Explorer />);

      expect(screen.getByText("Could not reach the Rekor server")).toBeInTheDocument();
    });

    it("shows API error with RekorError body message", () => {
      const apiError = new ApiError(
        {
          url: "http://rekor/api/v1/log",
          ok: false,
          status: 422,
          statusText: "Unprocessable Entity",
          body: { message: "Invalid entry", code: 422 },
        },
        "request error"
      );

      (useFetchRekorSearch as Mock).mockReturnValue({
        data: undefined,
        error: apiError,
        isLoading: false,
        failureCount: 0,
        refetch: vi.fn(),
      });

      renderWithProviders(<Explorer />);

      expect(screen.getByText("Invalid entry")).toBeInTheDocument();
      expect(screen.getByText("http://rekor/api/v1/log")).toBeInTheDocument();
    });

    it("shows API error with fallback code when message is missing", () => {
      const apiError = new ApiError(
        {
          url: "http://rekor/api/v1/log",
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
          body: { code: 500 },
        },
        "request error"
      );

      (useFetchRekorSearch as Mock).mockReturnValue({
        data: undefined,
        error: apiError,
        isLoading: false,
        failureCount: 0,
        refetch: vi.fn(),
      });

      renderWithProviders(<Explorer />);

      expect(screen.getByText("Error code 500")).toBeInTheDocument();
    });

    it("shows status text for API error with non-RekorError body", () => {
      const apiError = new ApiError(
        {
          url: "http://rekor/api/v1/log",
          ok: false,
          status: 503,
          statusText: "Service Unavailable",
          body: "plain text",
        },
        "request error"
      );

      (useFetchRekorSearch as Mock).mockReturnValue({
        data: undefined,
        error: apiError,
        isLoading: false,
        failureCount: 0,
        refetch: vi.fn(),
      });

      renderWithProviders(<Explorer />);

      expect(screen.getByText("503 Service Unavailable")).toBeInTheDocument();
    });

    it("shows message for generic Error", () => {
      (useFetchRekorSearch as Mock).mockReturnValue({
        data: undefined,
        error: new Error("something broke"),
        isLoading: false,
        failureCount: 0,
        refetch: vi.fn(),
      });

      renderWithProviders(<Explorer />);

      expect(screen.getByText("something broke")).toBeInTheDocument();
    });

    it("shows string errors directly", () => {
      (useFetchRekorSearch as Mock).mockReturnValue({
        data: undefined,
        error: "raw string error",
        isLoading: false,
        failureCount: 0,
        refetch: vi.fn(),
      });

      renderWithProviders(<Explorer />);

      expect(screen.getByText("raw string error")).toBeInTheDocument();
    });

    it("shows default message for unknown error types", () => {
      (useFetchRekorSearch as Mock).mockReturnValue({
        data: undefined,
        error: 42,
        isLoading: false,
        failureCount: 0,
        refetch: vi.fn(),
      });

      renderWithProviders(<Explorer />);

      expect(screen.getByText("An unexpected error occurred")).toBeInTheDocument();
    });

    it("calls refetch when retry button is clicked", () => {
      const refetch = vi.fn();
      (useFetchRekorSearch as Mock).mockReturnValue({
        data: undefined,
        error: new TypeError("Failed to fetch"),
        isLoading: false,
        failureCount: 0,
        refetch,
      });

      renderWithProviders(<Explorer />);
      fireEvent.click(screen.getByText("Retry"));

      expect(refetch).toHaveBeenCalled();
    });
  });

  describe("LoadingIndicator", () => {
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

  describe("URL query parameter handling", () => {
    it("parses email attribute from URL and triggers search", () => {
      (useLocation as Mock).mockReturnValue({
        pathname: "/rekor-search",
        search: "?email=user%40example.com",
        hash: "",
      });

      renderWithProviders(<Explorer />);

      expect(useFetchRekorSearch).toHaveBeenCalledWith({ attribute: "email", query: "user@example.com" }, 1);
    });

    it("parses logIndex attribute and converts to number", () => {
      (useLocation as Mock).mockReturnValue({
        pathname: "/rekor-search",
        search: "?logIndex=12345",
        hash: "",
      });

      renderWithProviders(<Explorer />);

      expect(useFetchRekorSearch).toHaveBeenCalledWith({ attribute: "logIndex", query: 12345 }, 1);
    });

    it("ignores unrecognized query parameters", () => {
      (useLocation as Mock).mockReturnValue({
        pathname: "/rekor-search",
        search: "?unknown=value",
        hash: "",
      });

      renderWithProviders(<Explorer />);

      expect(useFetchRekorSearch).toHaveBeenCalledWith(undefined, 1);
    });
  });

  describe("handleSubmit", () => {
    it("navigates with detected attribute on form submit", async () => {
      const navigate = vi.fn();
      (useNavigate as Mock).mockReturnValue(navigate);

      renderWithProviders(<Explorer />);

      const input = screen.getByRole("textbox", { name: "Search input field" });
      await userEvent.clear(input);
      await userEvent.type(input, "user@example.com");
      await userEvent.click(screen.getByRole("button", { name: "Search" }));

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith({
          pathname: "/rekor-search",
          search: "?email=user%40example.com",
        });
      });
    });

    it("does not navigate when attribute is not detected", async () => {
      const navigate = vi.fn();
      (useNavigate as Mock).mockReturnValue(navigate);

      renderWithProviders(<Explorer />);

      const input = screen.getByRole("textbox", { name: "Search input field" });
      await userEvent.clear(input);
      await userEvent.type(input, "not-a-valid-input!!!");
      await userEvent.click(screen.getByRole("button", { name: "Search" }));

      await waitFor(() => {
        expect(navigate).not.toHaveBeenCalled();
      });
    });
  });
});

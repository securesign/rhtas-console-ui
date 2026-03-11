import { SearchForm } from "./SearchForm";
import { render, screen, waitFor } from "@testing-library/react";
import { RekorClientProvider } from "../../../utils/rekor/api/context";
import userEvent from "@testing-library/user-event";

describe("SearchForm", () => {
  it("should render form with default values", () => {
    render(
      <RekorClientProvider>
        <SearchForm defaultValues={{ search: "" }} isLoading={false} onSubmit={vi.fn()} />
      </RekorClientProvider>
    );

    // Form now has single "Search" field
    expect(screen.getByRole("textbox", { name: "Search input field" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("submits the correct form data", async () => {
    const mockOnSubmit = vi.fn();
    render(
      <RekorClientProvider>
        <SearchForm onSubmit={mockOnSubmit} isLoading={false} />
      </RekorClientProvider>
    );

    // Enter search value
    await userEvent.type(screen.getByRole("textbox", { name: "Search input field" }), "test@example.com");

    // submit the form
    await userEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      const callArgs = mockOnSubmit.mock.calls[0];
      expect(callArgs[0]).toEqual({ search: "test@example.com" });
    });
  });
});

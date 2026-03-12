import { RekorSearchForm } from "./SearchForm";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RekorClientProvider } from "../../shared/utils/rekor/api/context";

describe("RekorSearchForm", () => {
  it("should render form with default values", () => {
    render(
      <RekorClientProvider>
        <RekorSearchForm onSubmit={vi.fn()} />
      </RekorClientProvider>
    );

    expect(screen.getByRole("textbox", { name: "Search input field" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("submits the correct form data", async () => {
    const mockOnSubmit = vi.fn();
    render(
      <RekorClientProvider>
        <RekorSearchForm onSubmit={mockOnSubmit} />
      </RekorClientProvider>
    );

    await userEvent.type(screen.getByRole("textbox", { name: "Search input field" }), "test@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith("test@example.com");
    });
  });
});

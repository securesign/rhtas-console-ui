import { SearchForm } from "./SearchForm";
import { render, screen, waitFor } from "@testing-library/react";
import { RekorClientProvider } from "../../../api/context";
import userEvent from "@testing-library/user-event";

describe("SearchForm", () => {
  it("should render form with default values", () => {
    render(
      <RekorClientProvider>
        <SearchForm defaultValues={{ attribute: "email", value: "" }} isLoading={false} onSubmit={vi.fn()} />
      </RekorClientProvider>
    );

    expect(screen.getByLabelText("Attribute")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue("");
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("submits the correct form data", async () => {
    const mockOnSubmit = vi.fn();
    render(
      <RekorClientProvider>
        <SearchForm onSubmit={mockOnSubmit} isLoading={false} />
      </RekorClientProvider>
    );

    // assume "email" is the default selected attribute; otherwise, select it first
    await userEvent.type(screen.getByLabelText(/Email input field/i), "test@example.com");

    // submit the form
    await userEvent.click(screen.getByText(/Search/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});

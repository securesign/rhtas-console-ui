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
import type { Mock } from "vitest";
import { RekorClientProvider } from "../../../api/context";
import { Explorer } from "./Explorer";

describe("Explorer", () => {
  it("renders without issues", () => {
    render(
      <RekorClientProvider>
        <Explorer />
      </RekorClientProvider>
    );

    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("should render search form and display search button", () => {
    render(
      <RekorClientProvider>
        <Explorer />
      </RekorClientProvider>
    );

    expect(screen.getByLabelText("Attribute")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Email input field" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("should handle invalid logIndex query parameter", () => {
    const mockNavigate = vi.fn();

    (useNavigate as Mock).mockImplementation(() => mockNavigate);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("displays loading indicator when fetching data", async () => {
    render(
      <RekorClientProvider>
        <Explorer />
      </RekorClientProvider>
    );

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

vi.mock("../../../api/context", () => ({
  useRekorBaseUrl: vi.fn(),
}));

import { render, screen } from "@testing-library/react";
import { Settings } from "./Settings";
import { useRekorBaseUrl } from "../../../api/context";
import type { Mock } from "vitest";

describe("Settings Component", () => {
  const mockOnClose = vi.fn();
  const mockSetBaseUrl = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // mock initial state & updater function returned by useRekorBaseUrl
    (useRekorBaseUrl as Mock).mockReturnValue(["https://initial.rekor.domain", mockSetBaseUrl]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders correctly with initial context value", () => {
    render(<Settings open={true} onClose={mockOnClose} />);
    expect(screen.getByLabelText("override rekor endpoint")).toHaveValue("https://initial.rekor.domain");
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});

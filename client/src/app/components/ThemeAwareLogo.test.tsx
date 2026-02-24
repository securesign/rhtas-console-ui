import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { ThemeAwareLogo } from "./ThemeAwareLogo";

vi.mock("@app/hooks/useDarkMode", () => ({
  useIsDarkMode: vi.fn(),
}));

import { useIsDarkMode } from "@app/hooks/useDarkMode";

const mockUseIsDarkMode = vi.mocked(useIsDarkMode);

describe("ThemeAwareLogo", () => {
  const mockProps = {
    lightSrc: "/light-logo.svg",
    darkSrc: "/dark-logo.svg",
    alt: "Test Logo",
    heights: { default: "36px" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render light logo when isDark is false", () => {
    mockUseIsDarkMode.mockReturnValue(false);

    render(<ThemeAwareLogo {...mockProps} />);

    const logo = screen.getByRole("img", { name: mockProps.alt });
    expect(logo).toHaveAttribute("src", mockProps.lightSrc);
  });

  it("should render dark logo when isDark is true", () => {
    mockUseIsDarkMode.mockReturnValue(true);

    render(<ThemeAwareLogo {...mockProps} />);

    const logo = screen.getByRole("img", { name: mockProps.alt });
    expect(logo).toHaveAttribute("src", mockProps.darkSrc);
  });

  it("should pass through alt text correctly", () => {
    mockUseIsDarkMode.mockReturnValue(false);

    render(<ThemeAwareLogo {...mockProps} />);

    expect(screen.getByRole("img", { name: mockProps.alt })).toBeInTheDocument();
  });
});

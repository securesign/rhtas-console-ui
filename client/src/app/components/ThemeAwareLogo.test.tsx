import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThemeContext } from "@tsd-ui/core";
import { ThemeAwareLogo } from "./ThemeAwareLogo";

const mockProps = {
  lightSrc: "/light-logo.svg",
  darkSrc: "/dark-logo.svg",
  alt: "Test Logo",
  heights: { default: "36px" },
};

const renderWithTheme = (isDark: boolean) =>
  render(
    <ThemeContext value={{ isDark, mode: isDark ? "dark" : "light", setMode: () => undefined }}>
      <ThemeAwareLogo {...mockProps} />
    </ThemeContext>
  );

describe("ThemeAwareLogo", () => {
  it("should render light logo when isDark is false", () => {
    renderWithTheme(false);

    const logo = screen.getByRole("img", { name: mockProps.alt });
    expect(logo).toHaveAttribute("src", mockProps.lightSrc);
  });

  it("should render dark logo when isDark is true", () => {
    renderWithTheme(true);

    const logo = screen.getByRole("img", { name: mockProps.alt });
    expect(logo).toHaveAttribute("src", mockProps.darkSrc);
  });

  it("should pass through alt text correctly", () => {
    renderWithTheme(false);

    expect(screen.getByRole("img", { name: mockProps.alt })).toBeInTheDocument();
  });
});

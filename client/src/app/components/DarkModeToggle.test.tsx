import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { DarkModeToggle } from "./DarkModeToggle";
import { THEME_MODES } from "@app/hooks/useDarkMode";

vi.mock("@app/hooks/useDarkMode.tsx", async () => {
  const actual = await vi.importActual("@app/hooks/useDarkMode.tsx");
  return {
    ...actual,
    useDarkMode: vi.fn(),
  };
});

import { useDarkMode } from "@app/hooks/useDarkMode.tsx";

const mockUseDarkMode = vi.mocked(useDarkMode);

describe("DarkModeToggle", () => {
  const mockSetMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.head.innerHTML = `<meta name="theme-color" content="#ffffff" />`;
  });

  describe("initial render", () => {
    it("should render with system mode selected", () => {
      mockUseDarkMode.mockReturnValue({
        mode: THEME_MODES.SYSTEM,
        setMode: mockSetMode,
        modes: THEME_MODES,
      });

      render(<DarkModeToggle />);

      expect(screen.getByLabelText(/Theme selection, current: System/i)).toBeInTheDocument();
    });

    it("should render with light mode selected", () => {
      mockUseDarkMode.mockReturnValue({
        mode: THEME_MODES.LIGHT,
        setMode: mockSetMode,
        modes: THEME_MODES,
      });

      render(<DarkModeToggle />);

      expect(screen.getByLabelText(/Theme selection, current: Light/i)).toBeInTheDocument();
    });

    it("should render with dark mode selected", () => {
      mockUseDarkMode.mockReturnValue({
        mode: THEME_MODES.DARK,
        setMode: mockSetMode,
        modes: THEME_MODES,
      });

      render(<DarkModeToggle />);

      expect(screen.getByLabelText(/Theme selection, current: Dark/i)).toBeInTheDocument();
    });
  });

  describe("dropdown interaction", () => {
    it("should open dropdown when toggle is clicked", async () => {
      mockUseDarkMode.mockReturnValue({
        mode: THEME_MODES.SYSTEM,
        setMode: mockSetMode,
        modes: THEME_MODES,
      });

      render(<DarkModeToggle />);

      const toggle = screen.getByLabelText(/Theme selection/i);
      await userEvent.click(toggle);

      await waitFor(() => {
        expect(screen.getByText("System")).toBeInTheDocument();
        expect(screen.getByText("Light")).toBeInTheDocument();
        expect(screen.getByText("Dark")).toBeInTheDocument();
      });
    });

    it("should display option descriptions when open", async () => {
      mockUseDarkMode.mockReturnValue({
        mode: THEME_MODES.SYSTEM,
        setMode: mockSetMode,
        modes: THEME_MODES,
      });

      render(<DarkModeToggle />);

      const toggle = screen.getByLabelText(/Theme selection/i);
      await userEvent.click(toggle);

      await waitFor(() => {
        expect(screen.getByText("Follow system preference")).toBeInTheDocument();
        expect(screen.getByText("Always use light mode")).toBeInTheDocument();
        expect(screen.getByText("Always use dark mode")).toBeInTheDocument();
      });
    });
  });

  describe("theme selection", () => {
    it("should call setMode with SYSTEM when System option is selected", async () => {
      mockUseDarkMode.mockReturnValue({
        mode: THEME_MODES.LIGHT,
        setMode: mockSetMode,
        modes: THEME_MODES,
      });

      render(<DarkModeToggle />);

      const toggle = screen.getByLabelText(/Theme selection/i);
      await userEvent.click(toggle);

      const systemOption = screen.getByRole("option", { name: /System/i });
      await userEvent.click(systemOption);

      await waitFor(() => {
        expect(mockSetMode).toHaveBeenCalledWith(THEME_MODES.SYSTEM);
      });
    });

    it("should call setMode with LIGHT when Light option is selected", async () => {
      mockUseDarkMode.mockReturnValue({
        mode: THEME_MODES.DARK,
        setMode: mockSetMode,
        modes: THEME_MODES,
      });

      render(<DarkModeToggle />);

      const toggle = screen.getByLabelText(/Theme selection/i);
      await userEvent.click(toggle);

      const lightOption = screen.getByRole("option", { name: /^Light/i });
      await userEvent.click(lightOption);

      await waitFor(() => {
        expect(mockSetMode).toHaveBeenCalledWith(THEME_MODES.LIGHT);
      });
    });

    it("should call setMode with DARK when Dark option is selected", async () => {
      mockUseDarkMode.mockReturnValue({
        mode: THEME_MODES.SYSTEM,
        setMode: mockSetMode,
        modes: THEME_MODES,
      });

      render(<DarkModeToggle />);

      const toggle = screen.getByLabelText(/Theme selection/i);
      await userEvent.click(toggle);

      const darkOption = screen.getByRole("option", { name: /^Dark/i });
      await userEvent.click(darkOption);

      await waitFor(() => {
        expect(mockSetMode).toHaveBeenCalledWith(THEME_MODES.DARK);
      });
    });
  });

  describe("accessibility", () => {
    it("should have proper aria-label on toggle button", () => {
      mockUseDarkMode.mockReturnValue({
        mode: THEME_MODES.SYSTEM,
        setMode: mockSetMode,
        modes: THEME_MODES,
      });

      render(<DarkModeToggle />);

      expect(screen.getByLabelText(/Theme selection, current: System/i)).toBeInTheDocument();
    });

    it("should have proper group label for color scheme", async () => {
      mockUseDarkMode.mockReturnValue({
        mode: THEME_MODES.SYSTEM,
        setMode: mockSetMode,
        modes: THEME_MODES,
      });

      render(<DarkModeToggle />);

      const toggle = screen.getByLabelText(/Theme selection/i);
      await userEvent.click(toggle);

      await waitFor(() => {
        expect(screen.getByText("Color scheme")).toBeInTheDocument();
      });
    });
  });
});

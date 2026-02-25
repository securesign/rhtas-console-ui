import { renderHook, act, waitFor } from "@testing-library/react";
import { STORAGE_KEY, DarkModeProvider, useDarkMode, THEME_MODES, useIsDarkMode } from "./useDarkMode";
import { vi } from "vitest";

const renderDarkModeHook = () => renderHook(() => useDarkMode(), { wrapper: DarkModeProvider });

const renderUseIsDarkMode = () => renderHook(() => useIsDarkMode(), { wrapper: DarkModeProvider });

const setMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    }),
  });
};

describe("useDarkMode hook", () => {
  describe("initial state", () => {
    it("should default to system mode when no preference is stored", () => {
      localStorage.clear();
      const { result } = renderDarkModeHook();
      const { mode } = result.current;
      expect(mode).toBe("system");
    });

    it("should restore saved preference from localStorage", () => {
      localStorage.setItem(STORAGE_KEY, THEME_MODES.DARK);
      const { result } = renderDarkModeHook();
      expect(result.current.mode).toBe("dark");
    });

    it("should ignore invalid localStorage values", () => {
      localStorage.setItem(STORAGE_KEY, "beige");
      const { result } = renderDarkModeHook();
      // Default to system
      expect(result.current.mode).toBe(THEME_MODES.SYSTEM);
    });
  });

  describe("mode switching", () => {
    beforeEach(() => {
      localStorage.clear();
      document.documentElement.className = "";
      document.head.innerHTML = `<meta name="theme-color" content="#ffffff" />`;
    });

    it("should switch to dark mode and update localStorage", async () => {
      localStorage.clear();
      const { result } = renderDarkModeHook();

      act(() => {
        result.current.setMode(THEME_MODES.DARK);
      });
      await waitFor(() => {
        expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
      });
    });

    it("should switch to light mode and update localStorage", async () => {
      const { result } = renderDarkModeHook();

      act(() => {
        result.current.setMode(THEME_MODES.LIGHT);
      });
      await waitFor(() => {
        expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
      });
    });

    it("should apply correct CSS class to document", async () => {
      const { result } = renderDarkModeHook();

      act(() => {
        result.current.setMode(THEME_MODES.DARK);
      });

      await waitFor(() => {
        expect(document.documentElement.classList.contains("pf-v6-theme-dark")).toBe(true);
      });
    });

    it("should update theme-color meta tag", async () => {
      document.head.innerHTML = `<meta name="theme-color" content="#ffffff" />`;

      const { result } = renderDarkModeHook();

      act(() => {
        result.current.setMode(THEME_MODES.DARK);
      });

      await waitFor(() => {
        expect(document.querySelector('meta[name="theme-color"]')?.getAttribute("content")).toBe("#000000");
      });
    });
  });

  describe("System Theme Detection", () => {
    beforeEach(() => {
      setMatchMedia(true); // True: Dark, False: Light
      localStorage.setItem(STORAGE_KEY, THEME_MODES.SYSTEM);
    });

    it("should detect dark system preference", async () => {
      const { result } = renderDarkModeHook();
      const { result: isDark } = renderUseIsDarkMode();
      await waitFor(() => {
        expect(result.current.mode).toBe(THEME_MODES.SYSTEM);
        expect(isDark.current).toBe(true);
      });
    });

    it("should detect light system preference", async () => {
      setMatchMedia(false);
      const { result } = renderDarkModeHook();
      const { result: isDark } = renderUseIsDarkMode();
      await waitFor(() => {
        expect(result.current.mode).toBe(THEME_MODES.SYSTEM);
        expect(isDark.current).toBe(false);
      });
    });

    it("should not apply system theme when mode is explicitly set", async () => {
      localStorage.setItem(STORAGE_KEY, THEME_MODES.DARK);
      setMatchMedia(false);
      const { result } = renderDarkModeHook();
      await waitFor(() => {
        expect(result.current.mode).toBe(THEME_MODES.DARK);
      });
    });
  });

  describe("Context Provider", () => {
    it("should throw error when used outside provider", () => {
      expect(() => {
        renderHook(() => useDarkMode());
      }).toThrow("useDarkMode must be used within DarkModeProvider");
    });

    it("should provide mode and setMode to children", () => {
      const { result } = renderDarkModeHook();
      expect(result.current.mode).toBeDefined();
      expect(result.current.setMode).toBeDefined();
    });
  });
});

describe("useIsDarkMode hook", () => {
  describe("Context Provider", () => {
    it("should throw error when used outside provider", () => {
      expect(() => {
        renderHook(() => useIsDarkMode());
      }).toThrow("useIsDarkMode must be used within DarkModeProvider");
    });
  });
});

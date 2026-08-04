import React, { useState } from "react";

const DARK_MODE_KEY = "pf-v6-theme-dark";

export const THEME_MODES = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark",
} as const;

export type ThemeMode = (typeof THEME_MODES)[keyof typeof THEME_MODES];

const getSystemTheme = (): Exclude<ThemeMode, "system"> => {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const isThemeModeValid = (value: string): value is ThemeMode => {
  return ["system", "light", "dark"].includes(value);
};

interface ThemeState {
  /** The current theme mode selection: "system", "light", or "dark". */
  mode: ThemeMode;
  /** Updates the theme mode. Invalid values are sanitized to "system". */
  setMode: (mode: ThemeMode) => void;
  /** Whether the active theme is dark, resolved from the mode and system preference. */
  isDark: boolean;
}

export const ThemeContext = React.createContext<ThemeState>({
  mode: "system",
  setMode: () => {},
  isDark: false,
});

interface IThemeProviderProps {
  children: React.ReactNode;
  mode: ThemeMode;
  setMode: (value: ThemeMode) => void;
}
export const ThemeProvider: React.FC<IThemeProviderProps> = ({ children, mode, setMode }) => {
  // "mode" sanitized
  const sanitizedMode: ThemeMode = isThemeModeValid(mode) ? mode : "system";

  // "setMode" sanitizer
  const setSanitizedMode = React.useCallback(
    (value: string) => {
      if (value && isThemeModeValid(value)) {
        setMode(value);
      } else {
        setMode("system");
      }
    },
    [setMode],
  );

  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(getSystemTheme);

  const isDark = sanitizedMode === THEME_MODES.DARK || (sanitizedMode === THEME_MODES.SYSTEM && systemTheme === "dark");

  React.useEffect(() => {
    const htmlElement = document.documentElement;
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    if (isDark) {
      htmlElement.classList.add(DARK_MODE_KEY);
      themeMeta?.setAttribute("content", "#000000");
    } else {
      htmlElement.classList.remove(DARK_MODE_KEY);
      themeMeta?.setAttribute("content", "#ffffff");
    }
  }, [isDark]);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setSystemTheme(getSystemTheme());
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, mode: sanitizedMode, setMode: setSanitizedMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

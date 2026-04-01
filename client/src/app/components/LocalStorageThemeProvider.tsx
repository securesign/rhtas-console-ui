import React, { useEffect, useState } from "react";
import { ThemeProvider, type ThemeMode } from "tsd-ui";

export const STORAGE_KEY = "theme-preference";

export default function LocalStorageThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored as ThemeMode;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  return (
    <ThemeProvider mode={mode} setMode={setMode}>
      {children}
    </ThemeProvider>
  );
}

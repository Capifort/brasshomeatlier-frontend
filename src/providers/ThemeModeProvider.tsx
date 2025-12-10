import { createContext, useCallback, useEffect, useMemo, useState, useContext } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { PaletteMode } from "@mui/material";
import { createAppTheme } from "../theme";

type ThemeModeContextValue = {
  mode: PaletteMode;
  toggleMode: () => void;
  setMode: (mode: PaletteMode) => void;
};

export const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: "light",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleMode: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMode: () => {}
});

const STORAGE_KEY = "theme-mode";

function getInitialMode(): PaletteMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // ignore
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<PaletteMode>(getInitialMode);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.colorScheme = mode;
    }
  }, [mode]);

  const setMode = useCallback((m: PaletteMode) => setModeState(m), []);
  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const value = useMemo<ThemeModeContextValue>(() => ({ mode, toggleMode, setMode }), [mode, toggleMode, setMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}



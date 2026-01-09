import { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createAppTheme } from "../theme";

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const theme = useMemo(() => createAppTheme("light"), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

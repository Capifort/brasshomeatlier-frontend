import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export function createAppTheme(mode: PaletteMode) {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#b8860b"
      },
      secondary: {
        main: "#6b7280"
      },
      background: isDark
        ? {
            default: "#121212",
            paper: "#1e1e1e"
          }
        : {
            default: "#faf9f6",
            paper: "#ffffff"
          }
    },
    shape: {
      borderRadius: 10
    },
    typography: {
      fontFamily:
        '"Inter", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 }
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true
        }
      }
    }
  });
}




import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export function createAppTheme(mode: PaletteMode) {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#8B1538", // Rich maroon like Prima
        light: "#A91D45",
        dark: "#6B102B"
      },
      secondary: {
        main: "#C9A962", // Brass gold accent
        light: "#D4BC7D",
        dark: "#B8944D"
      },
      background: isDark
        ? {
            default: "#0f0f0f",
            paper: "#1a1a1a"
          }
        : {
            default: "#ffffff",
            paper: "#f8f8f8"
          },
      text: isDark
        ? {
            primary: "#ffffff",
            secondary: "#a0a0a0"
          }
        : {
            primary: "#1a1a1a",
            secondary: "#666666"
          }
    },
    shape: {
      borderRadius: 4
    },
    typography: {
      fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
      h1: { fontWeight: 700, letterSpacing: "-0.02em" },
      h2: { fontWeight: 700, letterSpacing: "-0.01em" },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: "none" }
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true
        },
        styleOverrides: {
          root: {
            borderRadius: 4,
            padding: "10px 24px"
          },
          contained: {
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(139, 21, 56, 0.3)"
            }
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 12px 24px rgba(0,0,0,0.1)"
            }
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 4
          }
        }
      }
    }
  });
}

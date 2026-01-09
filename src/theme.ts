import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export function createAppTheme(mode: PaletteMode) {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? "#2997ff" : "#0071e3",
        light: "#5ac8fa",
        dark: "#0058b0"
      },
      secondary: {
        main: isDark ? "#98989d" : "#86868b",
        light: "#a1a1a6",
        dark: "#6e6e73"
      },
      background: isDark
        ? {
            default: "#000000",
            paper: "#1c1c1e"
          }
        : {
            default: "#fbfbfd",
            paper: "#ffffff"
          },
      text: isDark
        ? {
            primary: "#f5f5f7",
            secondary: "#a1a1a6"
          }
        : {
            primary: "#1d1d1f",
            secondary: "#86868b"
          },
      divider: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
    },
    shape: {
      borderRadius: 16
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
      h1: { fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1 },
      h2: { fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 },
      h3: { fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15 },
      h4: { fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.2 },
      h5: { fontWeight: 600, letterSpacing: "-0.01em" },
      h6: { fontWeight: 600, letterSpacing: "-0.01em" },
      body1: { letterSpacing: "-0.01em", lineHeight: 1.6 },
      body2: { letterSpacing: "-0.005em", lineHeight: 1.5 },
      button: { fontWeight: 500, textTransform: "none", letterSpacing: "-0.01em" }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: isDark
              ? "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(41, 151, 255, 0.15), transparent)"
              : "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 113, 227, 0.08), transparent)"
          }
        }
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true
        },
        styleOverrides: {
          root: {
            borderRadius: 980,
            padding: "14px 28px",
            fontSize: "1rem",
            fontWeight: 400,
            transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)"
          },
          contained: {
            background: isDark
              ? "linear-gradient(180deg, #3a9fff 0%, #0071e3 100%)"
              : "linear-gradient(180deg, #0077ed 0%, #0071e3 100%)",
            boxShadow: "0 2px 8px rgba(0,113,227,0.3)",
            "&:hover": {
              background: isDark
                ? "linear-gradient(180deg, #5ab0ff 0%, #0080ff 100%)"
                : "linear-gradient(180deg, #0080ff 0%, #0077ed 100%)",
              boxShadow: "0 4px 16px rgba(0,113,227,0.4)",
              transform: "translateY(-1px)"
            }
          },
          outlined: {
            borderWidth: 1.5,
            borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
            "&:hover": {
              borderWidth: 1.5,
              backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"
            }
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: "none",
            boxShadow: "none",
            background: isDark
              ? "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
              : "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
            backdropFilter: "blur(20px)",
            transition: "all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
            "&:hover": {
              transform: "scale(1.02) translateY(-4px)",
              boxShadow: isDark
                ? "0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)"
                : "0 24px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)"
            }
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 980,
            fontWeight: 500,
            transition: "all 0.2s ease"
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none"
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none"
          }
        }
      }
    }
  });
}

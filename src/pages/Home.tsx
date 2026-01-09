import { useEffect, useState } from "react";
import { Box, Typography, Skeleton, Grid2 as Grid, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SkuCard from "../components/SkuCard";
import { getSkus } from "../lib/api";
import type { Sku } from "../lib/database.types";

export default function Home() {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    async function loadData() {
      try {
        const skusData = await getSkus();
        setSkus(skusData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ pt: 8 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Skeleton width={120} height={16} sx={{ mx: "auto", mb: 2, borderRadius: 1 }} />
          <Skeleton width={350} height={56} sx={{ mx: "auto", mb: 1.5, borderRadius: 2 }} />
          <Skeleton width={280} height={24} sx={{ mx: "auto", borderRadius: 1 }} />
        </Box>
        <Grid container spacing={2.5}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={i}>
              <Skeleton
                variant="rectangular"
                sx={{
                  pt: "130%",
                  borderRadius: 4,
                  bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Header */}
      <Box
        sx={{
          textAlign: "center",
          pt: { xs: 1, md: 2 },
          pb: { xs: 3, md: 4 },
          position: "relative"
        }}
      >
        {/* Decorative gradient orb */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 300, md: 500 },
            height: { xs: 300, md: 500 },
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(circle, rgba(102,126,234,0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(102,126,234,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none"
          }}
        />

        <Typography
          variant="overline"
          sx={{
            color: "primary.main",
            letterSpacing: "0.15em",
            fontWeight: 600,
            fontSize: "0.75rem",
            mb: 2,
            display: "block"
          }}
        >
          Premium Collection
        </Typography>
        
        <Typography
          variant="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            mb: 2.5,
            background: isDark
              ? "linear-gradient(135deg, #fff 0%, #a1a1a6 100%)"
              : "linear-gradient(135deg, #1d1d1f 0%, #6e6e73 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          Brass Hardware
        </Typography>
        
        <Typography
          variant="h5"
          sx={{
            color: "text.secondary",
            fontWeight: 400,
            maxWidth: 500,
            mx: "auto",
            fontSize: { xs: "1.125rem", md: "1.375rem" },
            lineHeight: 1.5,
            letterSpacing: "-0.01em"
          }}
        >
          Beautifully crafted. Precision engineered.
          <br />
          Made for the finest interiors.
        </Typography>
      </Box>

      {/* Products Grid */}
      {skus.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 16 }}>
          No products available yet.
        </Typography>
      ) : (
        <Grid container spacing={2.5}>
          {skus.map((sku) => (
            <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={sku.id}>
              <SkuCard sku={sku} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Bottom spacer */}
      <Box sx={{ height: 80 }} />
    </Box>
  );
}

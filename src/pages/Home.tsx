import { useEffect, useState } from "react";
import { Box, Typography, Skeleton, Stack, Grid2 as Grid } from "@mui/material";
import SkuCard from "../components/SkuCard";
import { getSkus } from "../lib/api";
import type { Sku } from "../lib/database.types";

export default function Home() {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [loading, setLoading] = useState(true);

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
      <Box>
        <Skeleton width={200} height={40} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
              <Skeleton variant="rectangular" height={380} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Products Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            All Products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {skus.length} products available
          </Typography>
        </Box>
      </Stack>

      {/* Products Grid */}
      {skus.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 8 }}>
          No products available yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {skus.map((sku) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={sku.id}>
              <SkuCard sku={sku} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

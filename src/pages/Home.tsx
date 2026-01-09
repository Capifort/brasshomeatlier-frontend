import { useEffect, useState } from "react";
import { Box, Typography, Divider, Skeleton, Stack } from "@mui/material";
import CategoryList from "../components/CategoryList";
import SkuGrid from "../components/SkuGrid";
import { getCategories, getSkus } from "../lib/api";
import type { Category, Sku } from "../lib/database.types";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [skus, setSkus] = useState<Sku[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesData, skusData] = await Promise.all([getCategories(), getSkus()]);
        setCategories(categoriesData);
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
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
          Categories
        </Typography>
        <Stack direction="row" spacing={2}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" width={300} height={200} sx={{ borderRadius: 2 }} />
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Categories
      </Typography>
      <CategoryList categories={categories} />

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Featured SKUs
      </Typography>
      <SkuGrid skus={skus.slice(0, 3)} />
    </Box>
  );
}

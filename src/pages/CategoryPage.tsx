import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Alert, Box, Breadcrumbs, Link, Typography, Skeleton, Stack } from "@mui/material";
import SkuGrid from "../components/SkuGrid";
import { getCategoryById, getSkusByCategory } from "../lib/api";
import type { Category, Sku } from "../lib/database.types";

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [skus, setSkus] = useState<Sku[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!categoryId) return;
      try {
        const [categoryData, skusData] = await Promise.all([
          getCategoryById(categoryId),
          getSkusByCategory(categoryId)
        ]);
        setCategory(categoryData);
        setSkus(skusData);
      } catch (error) {
        console.error("Failed to load category:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [categoryId]);

  if (loading) {
    return (
      <Box>
        <Skeleton width={200} height={24} sx={{ mb: 2 }} />
        <Skeleton width={300} height={40} sx={{ mb: 1 }} />
        <Skeleton width="100%" height={20} sx={{ mb: 3 }} />
        <Stack direction="row" spacing={2}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" width={300} height={280} sx={{ borderRadius: 2 }} />
          ))}
        </Stack>
      </Box>
    );
  }

  if (!category) {
    return <Alert severity="warning">Category not found.</Alert>;
  }

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Home
        </Link>
        <Typography color="text.primary">{category.name}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        {category.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {category.description}
      </Typography>

      {skus.length === 0 ? (
        <Alert severity="info">No SKUs available in this category yet.</Alert>
      ) : (
        <SkuGrid skus={skus} />
      )}
    </Box>
  );
}

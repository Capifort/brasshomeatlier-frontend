import { useMemo } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Box, Breadcrumbs, Link, Typography, Alert } from "@mui/material";
import { categories, skus } from "../data/mockData";
import SkuGrid from "../components/SkuGrid";

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();

  const category = useMemo(() => categories.find((c) => c.id === categoryId), [categoryId]);
  const categorySkus = useMemo(() => skus.filter((s) => s.categoryId === categoryId), [categoryId]);

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

      <SkuGrid skus={categorySkus} />
    </Box>
  );
}



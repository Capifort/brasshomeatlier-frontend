import { useEffect, useState, useMemo } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Skeleton,
  Stack,
  Grid2 as Grid,
  Chip
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SkuCard from "../components/SkuCard";
import { getCategoryById, getSkusByCategory } from "../lib/api";
import type { Category, Sku } from "../lib/database.types";

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [skus, setSkus] = useState<Sku[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    async function loadData() {
      if (!categoryId) return;
      setLoading(true);
      try {
        const [categoryData, skusData] = await Promise.all([
          getCategoryById(categoryId),
          getSkusByCategory(categoryId)
        ]);
        setCategory(categoryData);
        setSkus(skusData);
        setSelectedFinish(null);
      } catch (error) {
        console.error("Failed to load category:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [categoryId]);

  const allFinishes = useMemo(() => {
    const finishSet = new Set<string>();
    skus.forEach((sku) => sku.finish_options.forEach((f) => finishSet.add(f)));
    return Array.from(finishSet).sort();
  }, [skus]);

  const filteredSkus = useMemo(() => {
    if (!selectedFinish) return skus;
    return skus.filter((sku) => sku.finish_options.includes(selectedFinish));
  }, [skus, selectedFinish]);

  if (loading) {
    return (
      <Box sx={{ pt: 4 }}>
        <Skeleton width={180} height={18} sx={{ mb: 4, borderRadius: 1 }} />
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Skeleton width={280} height={56} sx={{ mx: "auto", mb: 2, borderRadius: 2 }} />
          <Skeleton width={400} height={24} sx={{ mx: "auto", borderRadius: 1 }} />
        </Box>
        <Grid container spacing={2.5}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
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

  if (!category) {
    return <Alert severity="warning">Category not found.</Alert>;
  }

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ pt: 3, mb: 4 }}>
        <Link
          component={RouterLink}
          underline="hover"
          color="text.secondary"
          to="/"
          sx={{ fontSize: "0.8125rem", fontWeight: 500 }}
        >
          Home
        </Link>
        <Typography color="text.primary" sx={{ fontSize: "0.8125rem", fontWeight: 500 }}>
          {category.name}
        </Typography>
      </Breadcrumbs>

      {/* Category Header */}
      <Box
        sx={{
          textAlign: "center",
          pb: { xs: 5, md: 7 },
          position: "relative"
        }}
      >
        {/* Decorative gradient */}
        <Box
          sx={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: 200,
            borderRadius: "50%",
            background: isDark
              ? "radial-gradient(ellipse, rgba(118,75,162,0.12) 0%, transparent 70%)"
              : "radial-gradient(ellipse, rgba(118,75,162,0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none"
          }}
        />

        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "2.25rem", md: "3.25rem" },
            letterSpacing: "-0.03em",
            mb: 2
          }}
        >
          {category.name}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: 480,
            mx: "auto",
            fontSize: "1.0625rem",
            lineHeight: 1.6
          }}
        >
          {category.description}
        </Typography>
      </Box>

      {/* Finish Filter Pills */}
      {allFinishes.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          flexWrap="wrap"
          useFlexGap
          sx={{ mb: 5 }}
        >
          <Chip
            label="All"
            onClick={() => setSelectedFinish(null)}
            sx={{
              fontWeight: 500,
              px: 1,
              bgcolor: selectedFinish === null
                ? isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"
                : "transparent",
              border: "1px solid",
              borderColor: selectedFinish === null
                ? "transparent"
                : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              "&:hover": {
                bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"
              }
            }}
          />
          {allFinishes.map((finish) => (
            <Chip
              key={finish}
              label={finish}
              onClick={() => setSelectedFinish(finish === selectedFinish ? null : finish)}
              sx={{
                fontWeight: 500,
                px: 1,
                bgcolor: selectedFinish === finish
                  ? isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"
                  : "transparent",
                border: "1px solid",
                borderColor: selectedFinish === finish
                  ? "transparent"
                  : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                "&:hover": {
                  bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"
                }
              }}
            />
          ))}
        </Stack>
      )}

      {/* Products Count */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 4, textAlign: "center", fontWeight: 500 }}
      >
        {filteredSkus.length} {filteredSkus.length === 1 ? "product" : "products"}
      </Typography>

      {/* Products Grid */}
      {filteredSkus.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 16 }}>
          No products match the selected filter.
        </Typography>
      ) : (
        <Grid container spacing={2.5}>
          {filteredSkus.map((sku) => (
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

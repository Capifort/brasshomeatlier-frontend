import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Breadcrumbs,
  Chip,
  Divider,
  Grid2 as Grid,
  Link,
  Paper,
  Stack,
  Typography,
  Button,
  Skeleton,
  IconButton
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getSkuById, getCategoryById } from "../lib/api";
import type { Sku, Category } from "../lib/database.types";
import QuoteDialog from "../components/QuoteDialog";
import { useSettings } from "../contexts/SettingsContext";

export default function SkuDetailPage() {
  const { skuId } = useParams<{ skuId: string }>();
  const [sku, setSku] = useState<Sku | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { settings } = useSettings();

  // Get all images (use image_urls if available, otherwise fallback to image_url)
  const allImages = sku?.image_urls?.length 
    ? sku.image_urls 
    : sku?.image_url 
      ? [sku.image_url] 
      : ["https://images.unsplash.com/photo-1616386234729-1f4a9553b7c8?w=1200&q=80&auto=format&fit=crop"];

  useEffect(() => {
    async function loadData() {
      if (!skuId) return;
      try {
        const skuData = await getSkuById(skuId);
        setSku(skuData);
        if (skuData?.category_id) {
          const categoryData = await getCategoryById(skuData.category_id);
          setCategory(categoryData);
        }
        if (skuData?.finish_options.length) {
          setSelectedFinish(skuData.finish_options[0]);
        }
      } catch (error) {
        console.error("Failed to load SKU:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [skuId]);

  if (loading) {
    return (
      <Box sx={{ pt: 3 }}>
        <Skeleton width={220} height={18} sx={{ mb: 4, borderRadius: 1 }} />
        <Grid container spacing={{ xs: 4, md: 8 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Skeleton
              variant="rectangular"
              sx={{ pt: "100%", borderRadius: 4, bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Skeleton width="40%" height={18} sx={{ mb: 1, borderRadius: 1 }} />
            <Skeleton width="80%" height={48} sx={{ mb: 2, borderRadius: 2 }} />
            <Skeleton width="50%" height={36} sx={{ mb: 3, borderRadius: 1 }} />
            <Skeleton width="100%" height={80} sx={{ mb: 4, borderRadius: 2 }} />
            <Skeleton width="100%" height={56} sx={{ borderRadius: 100 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!sku) {
    return <Alert severity="warning">Product not found.</Alert>;
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
        {category && (
          <Link
            component={RouterLink}
            underline="hover"
            color="text.secondary"
            to={`/category/${category.id}`}
            sx={{ fontSize: "0.8125rem", fontWeight: 500 }}
          >
            {category.name}
          </Link>
        )}
        <Typography color="text.primary" sx={{ fontSize: "0.8125rem", fontWeight: 500 }}>
          {sku.name}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={{ xs: 4, md: 8 }}>
        {/* Product Images */}
        <Grid size={{ xs: 12, md: 7 }}>
          {/* Main Image */}
          <Box
            sx={{
              position: "relative",
              pt: "100%",
              borderRadius: 5,
              overflow: "hidden",
              bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f5f5f7",
              border: "1px solid",
              borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"
            }}
          >
            <Box
              component="img"
              src={allImages[selectedImageIndex]}
              alt={`${sku.name} - Image ${selectedImageIndex + 1}`}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "85%",
                height: "85%",
                objectFit: "contain",
                transition: "opacity 0.3s ease"
              }}
            />
            
            {/* Navigation arrows (only show if multiple images) */}
            {allImages.length > 1 && (
              <>
                <IconButton
                  onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                  sx={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.9)",
                    color: isDark ? "white" : "text.primary",
                    "&:hover": {
                      bgcolor: isDark ? "rgba(0,0,0,0.8)" : "white"
                    }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  onClick={() => setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.9)",
                    color: isDark ? "white" : "text.primary",
                    "&:hover": {
                      bgcolor: isDark ? "rgba(0,0,0,0.8)" : "white"
                    }
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
                
                {/* Image counter */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    bgcolor: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.9)",
                    color: isDark ? "white" : "text.primary",
                    px: 2,
                    py: 0.5,
                    borderRadius: 100,
                    fontSize: "0.875rem",
                    fontWeight: 500
                  }}
                >
                  {selectedImageIndex + 1} / {allImages.length}
                </Box>
              </>
            )}
          </Box>
          
          {/* Thumbnail strip (only show if multiple images) */}
          {allImages.length > 1 && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                mt: 2,
                overflowX: "auto",
                pb: 1,
                "&::-webkit-scrollbar": {
                  height: 6
                },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                  borderRadius: 3
                }
              }}
            >
              {allImages.map((url, index) => (
                <Box
                  key={`thumb-${index}`}
                  onClick={() => setSelectedImageIndex(index)}
                  sx={{
                    width: 72,
                    height: 72,
                    minWidth: 72,
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                    border: "2px solid",
                    borderColor: selectedImageIndex === index 
                      ? "primary.main" 
                      : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                    opacity: selectedImageIndex === index ? 1 : 0.7,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      opacity: 1,
                      borderColor: selectedImageIndex === index 
                        ? "primary.main" 
                        : isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={url}
                    alt={`${sku.name} thumbnail ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </Box>
              ))}
            </Stack>
          )}
        </Grid>

        {/* Product Details */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ position: "sticky", top: 100 }}>
            {/* Category */}
            {category && (
              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  fontSize: "0.75rem"
                }}
              >
                {category.name}
              </Typography>
            )}

            {/* Product Name */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "2.75rem" },
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                mt: 1,
                mb: 3
              }}
            >
              {sku.name}
            </Typography>

            {/* Price */}
            {settings.show_pricing && (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  fontSize: "1.75rem",
                  mb: 3
                }}
              >
                ${sku.price_per_kg_usd.toFixed(2)}
                <Typography
                  component="span"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 400,
                    fontSize: "1rem",
                    ml: 0.5
                  }}
                >
                  per kg
                </Typography>
              </Typography>
            )}

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.7,
                mb: 4,
                fontSize: "1.0625rem"
              }}
            >
              {sku.description}
            </Typography>

            {/* Finish Options */}
            {sku.finish_options.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
                >
                  Finish — <Box component="span" sx={{ fontWeight: 400, color: "text.secondary" }}>{selectedFinish}</Box>
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {sku.finish_options.map((f) => (
                    <Chip
                      key={f}
                      label={f}
                      onClick={() => setSelectedFinish(f)}
                      sx={{
                        fontWeight: 500,
                        bgcolor: selectedFinish === f
                          ? isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"
                          : "transparent",
                        border: "1px solid",
                        borderColor: selectedFinish === f
                          ? "transparent"
                          : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
                        "&:hover": {
                          bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"
                        }
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Order Info Card */}
            <Paper
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 4,
                bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                border: "1px solid",
                borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"
              }}
            >
              <Stack spacing={2.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Minimum Order
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {sku.min_order_kg} kg
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Lead Time
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {sku.lead_time_days} days
                  </Typography>
                </Stack>
                {settings.show_pricing && (
                  <>
                    <Divider sx={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Starting From
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        ${(sku.price_per_kg_usd * sku.min_order_kg).toFixed(2)}
                      </Typography>
                    </Stack>
                  </>
                )}
              </Stack>
            </Paper>

            {/* CTA Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => setQuoteOpen(true)}
              sx={{
                py: 2,
                fontSize: "1.0625rem",
                fontWeight: 500,
                borderRadius: 100
              }}
            >
              Request Quote
            </Button>

            {/* Back Link */}
            {category && (
              <Button
                component={RouterLink}
                to={`/category/${category.id}`}
                fullWidth
                sx={{
                  mt: 2,
                  color: "primary.main",
                  fontWeight: 500
                }}
              >
                Browse all {category.name}
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Specifications */}
      {sku.specs && typeof sku.specs === "object" && !Array.isArray(sku.specs) && Object.keys(sku.specs).length > 0 && (
        <Box sx={{ mt: 12, mb: 8 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 5,
              textAlign: "center",
              letterSpacing: "-0.02em"
            }}
          >
            Specifications
          </Typography>
          <Box
            sx={{
              maxWidth: 560,
              mx: "auto",
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid",
              borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
            }}
          >
            {Object.entries(sku.specs as Record<string, string | number>).map(([key, value], index, arr) => (
              <Box
                key={key}
                sx={{
                  px: 3,
                  py: 2,
                  bgcolor: index % 2 === 0
                    ? isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)"
                    : "transparent",
                  borderBottom: index < arr.length - 1 ? "1px solid" : "none",
                  borderColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {String(value)}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <QuoteDialog open={quoteOpen} onClose={() => setQuoteOpen(false)} skuId={sku.id} skuName={sku.name} />
    </Box>
  );
}

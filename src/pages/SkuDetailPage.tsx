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
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { getSkuById, getCategoryById } from "../lib/api";
import type { Sku, Category } from "../lib/database.types";
import QuoteDialog from "../components/QuoteDialog";

export default function SkuDetailPage() {
  const { skuId } = useParams<{ skuId: string }>();
  const [sku, setSku] = useState<Sku | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);

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
      <Box>
        <Skeleton width={300} height={24} sx={{ mb: 3 }} />
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton width="80%" height={48} sx={{ mb: 2 }} />
            <Skeleton width="100%" height={24} />
            <Skeleton width="100%" height={24} />
            <Skeleton width="60%" height={24} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!sku) {
    return <Alert severity="warning">SKU not found.</Alert>;
  }

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Home
        </Link>
        {category && (
          <Link component={RouterLink} underline="hover" color="inherit" to={`/category/${category.id}`}>
            {category.name}
          </Link>
        )}
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
          {sku.name}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={5}>
        {/* Product Image */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            variant="outlined"
            sx={{
              overflow: "hidden",
              borderRadius: 2,
              position: "sticky",
              top: 100
            }}
          >
            <Box
              component="img"
              src={
                sku.image_url ??
                "https://images.unsplash.com/photo-1616386234729-1f4a9553b7c8?w=1200&q=80&auto=format&fit=crop"
              }
              alt={sku.name}
              sx={{
                display: "block",
                width: "100%",
                height: { xs: 350, md: 500 },
                objectFit: "cover"
              }}
            />
          </Paper>
        </Grid>

        {/* Product Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.2 }}>
            {sku.name}
          </Typography>
          
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
              ${sku.price_per_kg_usd.toFixed(2)}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              per kg
            </Typography>
          </Stack>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
            {sku.description}
          </Typography>

          {/* Finish Options */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
              Finish Options
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {sku.finish_options.map((f) => (
                <Chip
                  key={f}
                  label={f}
                  onClick={() => setSelectedFinish(f)}
                  variant={selectedFinish === f ? "filled" : "outlined"}
                  color={selectedFinish === f ? "primary" : "default"}
                  sx={{
                    fontWeight: 500,
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "primary.main"
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Order Info */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              bgcolor: "background.default"
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Order Information
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Minimum Order
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {sku.min_order_kg} kg
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Standard Lead Time
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {sku.lead_time_days} days
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Estimated Total (Min Order)
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: "primary.main" }}>
                  ${(sku.price_per_kg_usd * sku.min_order_kg).toFixed(2)}
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          {/* CTA Buttons */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => setQuoteOpen(true)}
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              Request Quote
            </Button>
            {category && (
              <Button
                component={RouterLink}
                to={`/category/${category.id}`}
                variant="outlined"
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Back to {category.name}
              </Button>
            )}
          </Stack>

          {/* Trust Badges */}
          <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocalShippingIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                Global Shipping
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <VerifiedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                100% Solid Brass
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <SupportAgentIcon sx={{ color: "text.secondary", fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                24/7 Support
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      {/* Specifications */}
      {sku.specs && typeof sku.specs === "object" && !Array.isArray(sku.specs) && Object.keys(sku.specs).length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Specifications
          </Typography>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Table>
              <TableBody>
                {Object.entries(sku.specs as Record<string, string | number>).map(([key, value], index) => (
                  <TableRow
                    key={key}
                    sx={{
                      bgcolor: index % 2 === 0 ? "background.default" : "background.paper"
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500, width: "40%", py: 2 }}>
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>{String(value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}

      <QuoteDialog open={quoteOpen} onClose={() => setQuoteOpen(false)} skuId={sku.id} skuName={sku.name} />
    </Box>
  );
}

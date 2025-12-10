import { useMemo, useState } from "react";
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
  Button
} from "@mui/material";
import { skus, categories } from "../data/mockData";
import QuoteDialog from "../components/QuoteDialog";

export default function SkuDetailPage() {
  const { skuId } = useParams<{ skuId: string }>();
  const sku = useMemo(() => skus.find((s) => s.id === skuId), [skuId]);
  const category = useMemo(() => categories.find((c) => c.id === sku?.categoryId), [sku?.categoryId]);
  const [quoteOpen, setQuoteOpen] = useState(false);

  if (!sku) {
    return <Alert severity="warning">SKU not found.</Alert>;
  }

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Home
        </Link>
        {category && (
          <Link component={RouterLink} underline="hover" color="inherit" to={`/category/${category.id}`}>
            {category.name}
          </Link>
        )}
        <Typography color="text.primary">{sku.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                sku.imageUrl ??
                "https://images.unsplash.com/photo-1616386234729-1f4a9553b7c8?w=1200&q=80&auto=format&fit=crop"
              }
              alt={sku.name}
              style={{ display: "block", width: "100%", height: 380, objectFit: "cover" }}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {sku.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {sku.description}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
            {sku.finishOptions.map((f) => (
              <Chip key={f} label={f} variant="outlined" />
            ))}
          </Stack>

          <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Pricing
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              <strong>${sku.pricePerKgUsd.toFixed(2)}</strong> per kg
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Minimum order: {sku.minOrderKg} kg • Standard lead time: {sku.leadTimeDays} days
            </Typography>
          </Paper>

          <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
            <Button color="primary" variant="contained" onClick={() => setQuoteOpen(true)}>
              Get Quote
            </Button>
            {category && (
              <Button component={RouterLink} to={`/category/${category.id}`} variant="outlined">
                Back to {category.name}
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>

      {sku.specs && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Specifications
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1}>
              {Object.entries(sku.specs).map(([k, v]) => (
                <Stack key={k} direction="row" spacing={2} alignItems="center">
                  <Typography variant="body2" color="text.secondary" sx={{ width: 200 }}>
                    {k}
                  </Typography>
                  <Typography variant="body1">{String(v)}</Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </>
      )}

      <QuoteDialog open={quoteOpen} onClose={() => setQuoteOpen(false)} skuName={sku.name} />
    </Box>
  );
}



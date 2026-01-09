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
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Chip,
  Button,
  Collapse,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import SkuCard from "../components/SkuCard";
import { getCategoryById, getSkusByCategory } from "../lib/api";
import type { Category, Sku } from "../lib/database.types";

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [skus, setSkus] = useState<Sku[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [expandedFilters, setExpandedFilters] = useState({ finishes: true });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
        setSelectedFinishes([]);
      } catch (error) {
        console.error("Failed to load category:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [categoryId]);

  // Get all unique finish options
  const allFinishes = useMemo(() => {
    const finishSet = new Set<string>();
    skus.forEach((sku) => sku.finish_options.forEach((f) => finishSet.add(f)));
    return Array.from(finishSet).sort();
  }, [skus]);

  // Filter SKUs based on selected finishes
  const filteredSkus = useMemo(() => {
    if (selectedFinishes.length === 0) return skus;
    return skus.filter((sku) =>
      sku.finish_options.some((f) => selectedFinishes.includes(f))
    );
  }, [skus, selectedFinishes]);

  const handleFinishToggle = (finish: string) => {
    setSelectedFinishes((prev) =>
      prev.includes(finish) ? prev.filter((f) => f !== finish) : [...prev, finish]
    );
  };

  const clearFilters = () => {
    setSelectedFinishes([]);
  };

  const FilterContent = () => (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Filters
        </Typography>
        {selectedFinishes.length > 0 && (
          <Button size="small" onClick={clearFilters} color="primary">
            Clear All
          </Button>
        )}
      </Stack>

      {/* Availability Filter */}
      <Paper variant="outlined" sx={{ mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Availability
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked size="small" />}
              label={<Typography variant="body2">In Stock ({skus.length})</Typography>}
            />
          </FormGroup>
        </Box>
      </Paper>

      {/* Finish Options Filter */}
      {allFinishes.length > 0 && (
        <Paper variant="outlined" sx={{ mb: 2 }}>
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer"
            }}
            onClick={() => setExpandedFilters((prev) => ({ ...prev, finishes: !prev.finishes }))}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Finish Options
            </Typography>
            {expandedFilters.finishes ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>
          <Collapse in={expandedFilters.finishes}>
            <Divider />
            <Box sx={{ p: 2 }}>
              <FormGroup>
                {allFinishes.map((finish) => (
                  <FormControlLabel
                    key={finish}
                    control={
                      <Checkbox
                        size="small"
                        checked={selectedFinishes.includes(finish)}
                        onChange={() => handleFinishToggle(finish)}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        {finish} ({skus.filter((s) => s.finish_options.includes(finish)).length})
                      </Typography>
                    }
                  />
                ))}
              </FormGroup>
            </Box>
          </Collapse>
        </Paper>
      )}

      {/* Price Range Info */}
      <Paper variant="outlined" sx={{ mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Price Range
          </Typography>
          {skus.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              ${Math.min(...skus.map((s) => s.price_per_kg_usd)).toFixed(2)} -{" "}
              ${Math.max(...skus.map((s) => s.price_per_kg_usd)).toFixed(2)} per kg
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );

  if (loading) {
    return (
      <Box>
        <Skeleton width={200} height={24} sx={{ mb: 2 }} />
        <Skeleton width={300} height={48} sx={{ mb: 1 }} />
        <Skeleton width="60%" height={20} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                  <Skeleton variant="rectangular" height={380} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          </Grid>
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
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/">
          Home
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
          {category.name}
        </Typography>
      </Breadcrumbs>

      {/* Category Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          {category.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
          {category.description}
        </Typography>
      </Box>

      {/* Mobile Filter Button */}
      {isMobile && (
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setMobileFilterOpen(true)}
          sx={{ mb: 3 }}
        >
          Filters {selectedFinishes.length > 0 && `(${selectedFinishes.length})`}
        </Button>
      )}

      {/* Active Filters */}
      {selectedFinishes.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
          {selectedFinishes.map((finish) => (
            <Chip
              key={finish}
              label={finish}
              onDelete={() => handleFinishToggle(finish)}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Stack>
      )}

      <Grid container spacing={4}>
        {/* Desktop Filters Sidebar */}
        {!isMobile && (
          <Grid size={{ md: 3 }}>
            <FilterContent />
          </Grid>
        )}

        {/* Products Grid */}
        <Grid size={{ xs: 12, md: isMobile ? 12 : 9 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredSkus.length} of {skus.length} products
            </Typography>
          </Stack>

          {filteredSkus.length === 0 ? (
            <Alert severity="info">
              No products match the selected filters. Try adjusting your filters.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredSkus.map((sku) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={sku.id}>
                  <SkuCard sku={sku} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        PaperProps={{ sx: { width: 300, p: 2 } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Filters
          </Typography>
          <IconButton onClick={() => setMobileFilterOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <FilterContent />
      </Drawer>
    </Box>
  );
}

import { useEffect, useState } from "react";
import { Box, Typography, Skeleton, Grid2 as Grid, Card, CardMedia, CardContent, Paper, Stack, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { getCategories } from "../lib/api";
import type { Category } from "../lib/database.types";
import QuoteDialog from "../components/QuoteDialog";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    async function loadData() {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
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
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Skeleton
                variant="rectangular"
                sx={{
                  pt: "75%",
                  borderRadius: 4,
                  bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"
                }}
              />
              <Skeleton width="60%" height={32} sx={{ mt: 2, mx: "auto", borderRadius: 1 }} />
              <Skeleton width="80%" height={20} sx={{ mt: 1, mx: "auto", borderRadius: 1 }} />
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
          pb: { xs: 4, md: 6 },
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
          variant="h2"
          sx={{
            fontWeight: 500,
            fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            mb: 1.5,
            background: isDark
              ? "linear-gradient(135deg, #fff 0%, #a1a1a6 100%)"
              : "linear-gradient(135deg, #1d1d1f 0%, #6e6e73 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          Metal Hardware
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
          Made for the finest interiors and exteriors.
        </Typography>
      </Box>

      {/* Section Title */}
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          fontWeight: 600,
          mb: 4,
          letterSpacing: "-0.02em"
        }}
      >
        Shop by Category
      </Typography>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 16 }}>
          No categories available yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={category.id}>
              <Card
                component={RouterLink}
                to={`/category/${category.id}`}
                sx={{
                  height: "100%",
                  textDecoration: "none",
                  color: "inherit",
                  bgcolor: isDark ? "rgba(255,255,255,0.02)" : "background.paper",
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                  transition: "all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: isDark
                      ? "0 20px 40px rgba(0,0,0,0.4)"
                      : "0 20px 40px rgba(0,0,0,0.12)",
                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                    "& .category-image": {
                      transform: "translate(-50%, -50%) scale(1.08)"
                    }
                  }
                }}
              >
                <Box sx={{ position: "relative", pt: "70%", overflow: "hidden", bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f8f8f8" }}>
                  <CardMedia
                    component="img"
                    className="category-image"
                    image={category.image_url || "https://images.unsplash.com/photo-1616386234729-1f4a9553b7c8?w=800&q=80&auto=format&fit=crop"}
                    alt={category.name}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "80%",
                      height: "80%",
                      objectFit: "contain",
                      transition: "transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)"
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      fontSize: "1.25rem",
                      letterSpacing: "-0.01em"
                    }}
                  >
                    {category.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      fontSize: "0.9rem"
                    }}
                  >
                    {category.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Want Something Else CTA */}
      <Paper
        sx={{
          mt: 8,
          p: { xs: 4, md: 6 },
          textAlign: "center",
          borderRadius: 4,
          bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
          border: "1px solid",
          borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 1.5,
            letterSpacing: "-0.02em"
          }}
        >
          Want Something Else?
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 450, mx: "auto" }}
        >
          Can't find what you're looking for? Let us know your requirements and we'll help you out.
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<DescriptionOutlinedIcon />}
            onClick={() => setQuoteOpen(true)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 100,
              fontWeight: 500
            }}
          >
            Request Quote
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<EmailOutlinedIcon />}
            component="a"
            href="mailto:info@brasshomeatelier.com"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 100,
              fontWeight: 500
            }}
          >
            Email Us
          </Button>
        </Stack>
      </Paper>

      {/* Quote Dialog */}
      <QuoteDialog
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        skuId="00000000-0000-0000-0000-000000000000"
        skuName="General Inquiry"
      />

      {/* Bottom spacer */}
      <Box sx={{ height: 80 }} />
    </Box>
  );
}

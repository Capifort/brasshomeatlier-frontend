import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Card, CardContent, Grid2 as Grid, Typography, Stack, Skeleton, Button } from "@mui/material";
import { Category, Inventory2, RequestQuote, TrendingUp } from "@mui/icons-material";
import { getCategories, getSkus, getQuoteRequests } from "../../lib/api";
import type { QuoteRequest } from "../../lib/database.types";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ categories: 0, skus: 0, quotes: 0, pendingQuotes: 0 });
  const [recentQuotes, setRecentQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [categories, skus, quotes] = await Promise.all([getCategories(), getSkus(), getQuoteRequests()]);
        setStats({
          categories: categories.length,
          skus: skus.length,
          quotes: quotes.length,
          pendingQuotes: quotes.filter((q) => q.status === "pending").length
        });
        setRecentQuotes(quotes.slice(0, 5));
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const statCards = [
    { label: "Categories", value: stats.categories, icon: <Category />, color: "#6366f1", path: "/admin/categories" },
    { label: "SKUs", value: stats.skus, icon: <Inventory2 />, color: "#10b981", path: "/admin/skus" },
    { label: "Total Quotes", value: stats.quotes, icon: <RequestQuote />, color: "#f59e0b", path: "/admin/quotes" },
    { label: "Pending Quotes", value: stats.pendingQuotes, icon: <TrendingUp />, color: "#ef4444", path: "/admin/quotes" }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
            <Card
              component={RouterLink}
              to={stat.path}
              sx={{
                textDecoration: "none",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6
                }
              }}
            >
              <CardContent>
                {loading ? (
                  <Skeleton variant="rectangular" height={80} />
                ) : (
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        backgroundColor: `${stat.color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Recent Quote Requests
            </Typography>
            <Button component={RouterLink} to="/admin/quotes" size="small">
              View All
            </Button>
          </Stack>

          {loading ? (
            <Stack spacing={2}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
              ))}
            </Stack>
          ) : recentQuotes.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
              No quote requests yet
            </Typography>
          ) : (
            <Stack spacing={1}>
              {recentQuotes.map((quote) => (
                <Box
                  key={quote.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "action.hover",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {quote.customer_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {quote.sku_name} • {quote.quantity_kg} kg
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography
                      variant="caption"
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 600,
                        backgroundColor:
                          quote.status === "pending"
                            ? "warning.light"
                            : quote.status === "contacted"
                            ? "info.light"
                            : quote.status === "quoted"
                            ? "success.light"
                            : "grey.300",
                        color:
                          quote.status === "pending"
                            ? "warning.dark"
                            : quote.status === "contacted"
                            ? "info.dark"
                            : quote.status === "quoted"
                            ? "success.dark"
                            : "grey.700"
                      }}
                    >
                      {quote.status}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                      {new Date(quote.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

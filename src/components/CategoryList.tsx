import { Card, CardContent, CardMedia, Typography, CardActionArea, Grid2 as Grid, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Category } from "../lib/database.types";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

type Props = {
  categories: Category[];
};

export default function CategoryList({ categories }: Props) {
  return (
    <Grid container spacing={3}>
      {categories.map((c) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={c.id}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              "&:hover": {
                borderColor: "primary.main",
                "& .category-image": {
                  transform: "scale(1.08)"
                },
                "& .arrow-icon": {
                  transform: "translateX(4px)"
                }
              }
            }}
          >
            <CardActionArea
              component={RouterLink}
              to={`/category/${c.id}`}
              sx={{ height: "100%" }}
            >
              <Box sx={{ overflow: "hidden" }}>
                <CardMedia
                  component="img"
                  height="220"
                  image={c.image_url || "https://images.unsplash.com/photo-1616386234729-1f4a9553b7c8?w=800&q=80&auto=format&fit=crop"}
                  alt={c.name}
                  className="category-image"
                  sx={{
                    objectFit: "cover",
                    transition: "transform 0.4s ease"
                  }}
                />
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {c.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {c.description}
                    </Typography>
                  </Box>
                  <ArrowForwardIcon
                    className="arrow-icon"
                    sx={{
                      color: "primary.main",
                      transition: "transform 0.2s ease",
                      ml: 2
                    }}
                  />
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

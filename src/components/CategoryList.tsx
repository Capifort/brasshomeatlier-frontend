import { Card, CardContent, CardMedia, Typography, Box, Grid2 as Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Category } from "../lib/database.types";

type Props = {
  categories: Category[];
};

export default function CategoryList({ categories }: Props) {
  return (
    <Grid container spacing={2}>
      {categories.map((c) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={c.id}>
          <Card
            component={RouterLink}
            to={`/category/${c.id}`}
            sx={{
              height: "100%",
              textDecoration: "none",
              color: "inherit",
              bgcolor: "background.paper",
              cursor: "pointer",
              overflow: "hidden"
            }}
          >
            <Box sx={{ position: "relative", pt: "75%", overflow: "hidden" }}>
              <CardMedia
                component="img"
                image={c.image_url || "https://images.unsplash.com/photo-1616386234729-1f4a9553b7c8?w=800&q=80&auto=format&fit=crop"}
                alt={c.name}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)"
                }}
              />
            </Box>
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {c.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {c.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

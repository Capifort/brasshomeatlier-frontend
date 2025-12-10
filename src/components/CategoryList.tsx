import { Card, CardContent, CardMedia, Typography, CardActionArea, Grid2 as Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Category } from "../data/mockData";

type Props = {
  categories: Category[];
};

export default function CategoryList({ categories }: Props) {
  return (
    <Grid container spacing={2}>
      {categories.map((c) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={c.id}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardActionArea component={RouterLink} to={`/category/${c.id}`} sx={{ height: "100%" }}>
              {c.imageUrl && (
                <CardMedia component="img" height="160" image={c.imageUrl} alt={c.name} sx={{ objectFit: "cover" }} />
              )}
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {c.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {c.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}



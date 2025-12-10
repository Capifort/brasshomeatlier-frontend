import { Box, Typography, Stack, Button, Divider } from "@mui/material";
import CategoryList from "../components/CategoryList";
import SkuGrid from "../components/SkuGrid";
import { categories, skus } from "../data/mockData";
import { Link as RouterLink } from "react-router-dom";

export default function Home() {
  return (
    <Box>
      <Box
        sx={{
          background:
            "radial-gradient(1200px 500px at 10% -10%, rgba(184,134,11,0.15), rgba(0,0,0,0) 70%), radial-gradient(800px 400px at 110% 30%, rgba(184,134,11,0.08), rgba(0,0,0,0) 60%)",
          borderRadius: 2,
          p: { xs: 3, md: 6 },
          mb: 4
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          Premium Brass Hardware
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 740, mb: 2 }}>
          Crafted for durability and elegance. Explore our knobs, handles, and hinges in a variety of finishes.
        </Typography>
        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <Button component={RouterLink} to="/category/knobs" variant="contained">
            Shop Knobs
          </Button>
          <Button component={RouterLink} to="/category/handles" variant="outlined">
            Shop Handles
          </Button>
          <Button component={RouterLink} to="/category/hinges" variant="outlined">
            Shop Hinges
          </Button>
        </Stack>
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Categories
      </Typography>
      <CategoryList categories={categories} />

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Featured SKUs
      </Typography>
      <SkuGrid skus={skus.slice(0, 3)} />
    </Box>
  );
}



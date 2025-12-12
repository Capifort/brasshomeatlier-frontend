import { Box, Typography, Divider } from "@mui/material";
import CategoryList from "../components/CategoryList";
import SkuGrid from "../components/SkuGrid";
import { categories, skus } from "../data/mockData";

export default function Home() {
  return (
    <Box>
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



import { Container, Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import SkuDetailPage from "./pages/SkuDetailPage";

export default function App() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Container maxWidth="lg" sx={{ pb: 6, pt: 2 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/sku/:skuId" element={<SkuDetailPage />} />
        </Routes>
      </Container>
    </Box>
  );
}



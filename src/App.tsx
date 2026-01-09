import { Container, Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import SkuDetailPage from "./pages/SkuDetailPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminSkus from "./pages/admin/AdminSkus";
import AdminQuotes from "./pages/admin/AdminQuotes";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="skus" element={<AdminSkus />} />
          <Route path="quotes" element={<AdminQuotes />} />
        </Route>

        {/* Public Routes */}
        <Route
          path="*"
          element={
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
          }
        />
      </Routes>
    </AuthProvider>
  );
}

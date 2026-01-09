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
import AdminSettings from "./pages/admin/AdminSettings";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="skus" element={<AdminSkus />} />
            <Route path="quotes" element={<AdminQuotes />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Public Routes */}
          <Route
            path="*"
            element={
              <Box display="flex" flexDirection="column" minHeight="100vh">
                <Navbar />
                <Container maxWidth="xl" sx={{ flex: 1, pb: 6, pt: 4, px: { xs: 2, md: 3 } }}>
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
      </SettingsProvider>
    </AuthProvider>
  );
}

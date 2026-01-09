import { Navigate, Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  Stack
} from "@mui/material";
import {
  Dashboard,
  Category,
  Inventory2,
  RequestQuote,
  Logout,
  Menu as MenuIcon
} from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const DRAWER_WIDTH = 260;

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: <Dashboard /> },
  { path: "/admin/categories", label: "Categories", icon: <Category /> },
  { path: "/admin/skus", label: "SKUs", icon: <Inventory2 /> },
  { path: "/admin/quotes", label: "Quote Requests", icon: <RequestQuote /> }
];

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#b8860b" }}>
          Brass Home Atelier
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Admin Panel
        </Typography>
      </Box>

      <Divider />

      <List sx={{ flex: 1, px: 2, py: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={() => isMobile && setMobileOpen(false)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              "&.Mui-selected": {
                backgroundColor: "rgba(184,134,11,0.15)",
                "&:hover": { backgroundColor: "rgba(184,134,11,0.2)" }
              },
              "&:hover": { backgroundColor: "rgba(184,134,11,0.08)" }
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? "#b8860b" : "inherit", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 700 : 500
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <List sx={{ px: 2, py: 1 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            "&:hover": { backgroundColor: "rgba(211,47,47,0.1)" }
          }}
        >
          <ListItemIcon sx={{ color: "error.main", minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ color: "error.main" }} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "background.paper",
            borderBottom: 1,
            borderColor: "divider"
          }}
          elevation={0}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#b8860b" }}>
              Admin
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: 1,
            borderColor: "divider"
          }
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: isMobile ? 8 : 0,
          backgroundColor: "background.default",
          minHeight: "100vh"
        }}
      >
        <Stack sx={{ maxWidth: 1200, mx: "auto" }}>
          <Outlet />
        </Stack>
      </Box>
    </Box>
  );
}

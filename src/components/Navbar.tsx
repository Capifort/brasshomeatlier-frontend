import { useState, useEffect, useContext } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Container,
  Stack,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Badge
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeModeContext } from "../providers/ThemeModeProvider";
import { getCategories } from "../lib/api";
import type { Category } from "../lib/database.types";

export default function Navbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleMode } = useContext(ThemeModeContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const goToCategory = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Top Banner */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 1,
          textAlign: "center"
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.85rem" }}>
          Get flat <strong>15% OFF</strong> on all Brass Home Atelier Products — Use code{" "}
          <Box component="span" sx={{ bgcolor: "rgba(255,255,255,0.2)", px: 1, py: 0.25, borderRadius: 1, fontWeight: 700 }}>
            BRASS15
          </Box>{" "}
          at checkout
        </Typography>
      </Box>

      {/* Main Navbar */}
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper"
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1, px: { xs: 0 } }}>
            {/* Mobile Menu Button */}
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                mr: 4
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "primary.main",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  fontSize: { xs: "1.25rem", md: "1.5rem" }
                }}
              >
                BRASS
                <Box component="span" sx={{ color: "secondary.main" }}>HOME</Box>
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  ml: 1,
                  display: { xs: "none", sm: "block" },
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}
              >
                Atelier
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                display: { xs: "none", md: "flex" },
                flexGrow: 1
              }}
            >
              <Button
                component={RouterLink}
                to="/"
                sx={{ color: "text.primary", fontWeight: 500, px: 2 }}
              >
                Home
              </Button>
              {categories.map((c) => (
                <Button
                  key={c.id}
                  onClick={() => goToCategory(c.id)}
                  sx={{ color: "text.primary", fontWeight: 500, px: 2 }}
                >
                  {c.name}
                </Button>
              ))}
              <Button
                component={RouterLink}
                to="/admin/login"
                sx={{ color: "text.secondary", fontWeight: 500, px: 2 }}
              >
                Admin
              </Button>
            </Stack>

            {/* Right Icons */}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconButton size="small" sx={{ color: "text.primary" }}>
                <SearchIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={toggleMode}
                sx={{ color: "text.primary" }}
              >
                {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <IconButton
                component={RouterLink}
                to="/admin/login"
                size="small"
                sx={{ color: "text.primary", display: { xs: "none", sm: "flex" } }}
              >
                <PersonOutlineIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
            Menu
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItemButton onClick={() => { navigate("/"); setMobileOpen(false); }}>
            <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
          {categories.map((c) => (
            <ListItemButton key={c.id} onClick={() => goToCategory(c.id)}>
              <ListItemText primary={c.name} primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItemButton onClick={() => { navigate("/admin/login"); setMobileOpen(false); }}>
            <ListItemText primary="Admin Login" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}

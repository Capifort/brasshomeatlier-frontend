import { useState, useEffect } from "react";
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
  Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { getCategories } from "../lib/api";
import type { Category } from "../lib/database.types";

export default function Navbar() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [])

  const goToCategory = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
    setMobileOpen(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: scrolled ? "rgba(251,251,253,0.85)" : "transparent",
          backdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid" : "none",
          borderColor: "divider",
          transition: "all 0.3s ease"
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 1, px: { xs: 0 }, minHeight: { xs: 52, sm: 56 } }}>
            {/* Mobile Menu Button */}
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1, display: { md: "none" }, color: "text.primary" }}
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
                alignItems: "center"
              }}
            >
              <Box
                component="img"
                src="https://orackhehwyggohpawsqd.supabase.co/storage/v1/object/public/images/skus/WhatsApp%20Image%202026-01-10%20at%201.49.56%20AM.jpeg"
                alt="Brass Home"
                sx={{
                  height: { xs: 70, sm: 56, md: 64 },
                  width: "auto",
                  objectFit: "contain"
                }}
              />
            </Box>

            {/* Desktop Navigation */}
            <Stack
              direction="row"
              spacing={0}
              sx={{
                display: { xs: "none", md: "flex" },
                flexGrow: 1,
                justifyContent: "center"
              }}
            >
              {categories.map((c) => (
                <Button
                  key={c.id}
                  onClick={() => goToCategory(c.id)}
                  sx={{
                    color: "text.secondary",
                    fontWeight: 400,
                    fontSize: "0.875rem",
                    px: 2,
                    py: 1,
                    minWidth: "auto",
                    borderRadius: 2,
                    "&:hover": {
                      color: "text.primary",
                      bgcolor: "rgba(0,0,0,0.04)"
                    }
                  }}
                >
                  {c.name}
                </Button>
              ))}
            </Stack>

            {/* Spacer */}
            <Box sx={{ ml: "auto" }} />
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 320,
            bgcolor: "background.default",
            backgroundImage: "none"
          }
        }}
      >
        <Box sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Menu
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ pt: 2, px: 1 }}>
          <ListItemButton
            onClick={() => { navigate("/"); setMobileOpen(false); }}
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            <ListItemText
              primary="Home"
              primaryTypographyProps={{ fontWeight: 500, fontSize: "1.0625rem" }}
            />
          </ListItemButton>
          {categories.map((c) => (
            <ListItemButton
              key={c.id}
              onClick={() => goToCategory(c.id)}
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              <ListItemText
                primary={c.name}
                primaryTypographyProps={{ fontWeight: 500, fontSize: "1.0625rem" }}
              />
            </ListItemButton>
          ))}
          <Divider sx={{ my: 2 }} />
          <ListItemButton
            onClick={() => { navigate("/admin/login"); setMobileOpen(false); }}
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            <ListItemText
              primary="Admin"
              primaryTypographyProps={{ fontWeight: 500, fontSize: "1.0625rem", color: "text.secondary" }}
            />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
}

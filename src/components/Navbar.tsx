import { useState, useEffect, useContext } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeModeContext } from "../providers/ThemeModeProvider";
import { getCategories } from "../lib/api";
import type { Category } from "../lib/database.types";

export default function Navbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleMode } = useContext(ThemeModeContext);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const goToCategory = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <AppBar position="sticky" color="inherit" sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: "none", color: "primary.main", fontWeight: 800, mr: 2 }}
        >
          Brass Home Atelier
        </Typography>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, mr: 1, flexGrow: 1 }}>
          {categories.map((c) => (
            <Button key={c.id} color="primary" variant="text" onClick={() => goToCategory(c.id)} sx={{ fontWeight: 600 }}>
              {c.name}
            </Button>
          ))}
        </Box>

        <IconButton
          edge="end"
          color="primary"
          aria-label="Toggle dark mode"
          onClick={toggleMode}
          sx={{ ml: 0.5 }}
        >
          {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <IconButton edge="end" color="primary" sx={{ display: { xs: "inline-flex", md: "none" }, ml: 1 }}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

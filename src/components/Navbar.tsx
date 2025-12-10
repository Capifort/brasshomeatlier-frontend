import { useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  ListItemText,
  Divider,
  IconButton,
  Popover,
  List,
  ListItemButton,
  Paper,
  Stack,
  Chip,
  ButtonBase
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { categories, skus } from "../data/mockData";
import { ThemeModeContext } from "../providers/ThemeModeProvider";
import { useContext } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleMode } = useContext(ThemeModeContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?.id ?? "");

  const isMegaOpen = Boolean(anchorEl);

  const categoryIdToSkus = useMemo(() => {
    const map = new Map<string, typeof skus>();
    for (const c of categories) map.set(c.id, []);
    for (const s of skus) {
      if (!map.has(s.categoryId)) map.set(s.categoryId, []);
      map.get(s.categoryId)!.push(s);
    }
    return map;
  }, []);

  const openCategories = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMega = () => {
    setAnchorEl(null);
  };

  const goToCategory = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
    closeMega();
  };

  const goToSku = (skuId: string) => {
    navigate(`/sku/${skuId}`);
    closeMega();
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
          brasshomeatlier
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          color="primary"
          variant="text"
          onClick={openCategories}
          aria-controls={isMegaOpen ? "categories-mega" : undefined}
          aria-haspopup="true"
          aria-expanded={isMegaOpen ? "true" : undefined}
          sx={{ mr: 1, fontWeight: 600 }}
        >
          Categories
        </Button>
        <Popover
          id="categories-mega"
          open={isMegaOpen}
          anchorEl={anchorEl}
          onClose={closeMega}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            elevation: 3,
            sx: {
              p: 2,
              width: { xs: 320, sm: 720 },
              maxWidth: "90vw"
            }
          }}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "300px 1fr" }, gap: 2 }}>
            <Paper variant="outlined" sx={{ overflow: "hidden" }}>
              <Box sx={{ p: 1.5, pb: 0 }}>
                <Typography variant="overline" color="text.secondary">
                  Categories
                </Typography>
              </Box>
              <List dense disablePadding sx={{ maxHeight: 360, overflow: "auto" }}>
                {categories.map((c) => (
                  <ListItemButton
                    key={c.id}
                    selected={activeCategoryId === c.id}
                    onMouseEnter={() => setActiveCategoryId(c.id)}
                    onClick={() => goToCategory(c.id)}
                    sx={{ alignItems: "flex-start", py: 1.2 }}
                  >
                    <ListItemText
                      primary={c.name}
                      secondary={c.description}
                      primaryTypographyProps={{ fontWeight: 700 }}
                      secondaryTypographyProps={{ noWrap: true }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>

            <Paper variant="outlined" sx={{ p: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="overline" color="text.secondary">
                  SKUs
                </Typography>
                <Button size="small" variant="text" onClick={() => goToCategory(activeCategoryId)}>
                  View all
                </Button>
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
                {(categoryIdToSkus.get(activeCategoryId) ?? []).map((s) => (
                  <ButtonBase
                    key={s.id}
                    onClick={() => goToSku(s.id)}
                    sx={{
                      textAlign: "left",
                      borderRadius: 1,
                      p: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      alignItems: "stretch"
                    }}
                  >
                    <Stack spacing={0.5} sx={{ width: "100%" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {s.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {s.description}
                      </Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap>
                        <Chip size="small" label={`$${s.pricePerKgUsd.toFixed(2)}/kg`} color="primary" variant="outlined" />
                        {s.finishOptions.slice(0, 2).map((f) => (
                          <Chip size="small" key={f} label={f} variant="outlined" />
                        ))}
                      </Stack>
                    </Stack>
                  </ButtonBase>
                ))}
                {(categoryIdToSkus.get(activeCategoryId) ?? []).length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No SKUs available for this category.
                  </Typography>
                )}
              </Box>
            </Paper>
          </Box>
        </Popover>

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


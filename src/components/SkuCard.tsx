import { Card, CardContent, CardMedia, Typography, Box, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import type { Sku } from "../lib/database.types";

type Props = {
  sku: Sku;
};

export default function SkuCard({ sku }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card
      component={RouterLink}
      to={`/sku/${sku.id}`}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        overflow: "hidden",
        border: "1px solid",
        borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        background: isDark
          ? "linear-gradient(145deg, rgba(28,28,30,0.8) 0%, rgba(28,28,30,0.6) 100%)"
          : "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)",
        "&:hover": {
          borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
          "& .product-image": {
            transform: "scale(1.05)"
          }
        }
      }}
    >
      {/* Image Container */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: "100%",
          bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f5f5f7"
        }}
      >
        <CardMedia
          component="img"
          image={sku.image_url || "https://images.unsplash.com/photo-1616386234729-1f4a9553b7c8?w=800&q=80&auto=format&fit=crop"}
          alt={sku.name}
          className="product-image"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)"
          }}
        />
        
        {/* Gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "30%",
            background: "linear-gradient(to top, rgba(0,0,0,0.1), transparent)",
            pointerEvents: "none"
          }}
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Stack spacing={0.5}>
          {/* Finish preview */}
          {sku.finish_options.length > 0 && (
            <Stack direction="row" spacing={0.25} alignItems="center">
              {sku.finish_options.slice(0, 3).map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: i === 0 ? "#c9a962" : i === 1 ? "#a8a8a8" : "#4a4a4a"
                  }}
                />
              ))}
            </Stack>
          )}

          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
              lineHeight: 1.3,
              color: "text.primary",
              mt: 0.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {sku.name}
          </Typography>

          <Box sx={{ mt: "auto", pt: 1.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                fontSize: "0.9375rem"
              }}
            >
              ${sku.price_per_kg_usd.toFixed(2)}
              <Typography
                component="span"
                sx={{
                  color: "text.secondary",
                  fontWeight: 400,
                  fontSize: "0.75rem",
                  ml: 0.25
                }}
              >
                /kg
              </Typography>
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

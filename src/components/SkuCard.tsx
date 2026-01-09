import { Card, CardContent, CardMedia, Typography, CardActions, Button, Chip, Stack, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Sku } from "../lib/database.types";

type Props = {
  sku: Sku;
};

export default function SkuCard({ sku }: Props) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        "&:hover": {
          borderColor: "primary.main",
          "& .sku-image": {
            transform: "scale(1.05)"
          }
        }
      }}
    >
      <Box sx={{ overflow: "hidden", position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={sku.image_url || "https://images.unsplash.com/photo-1616386234729-1f4a9553b7c8?w=800&q=80&auto=format&fit=crop"}
          alt={sku.name}
          className="sku-image"
          sx={{
            objectFit: "cover",
            transition: "transform 0.3s ease"
          }}
        />
        {sku.min_order_kg && (
          <Chip
            label={`Min. ${sku.min_order_kg}kg`}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              bgcolor: "primary.main",
              color: "white",
              fontWeight: 600,
              fontSize: "0.7rem"
            }}
          />
        )}
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 1,
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {sku.name}
        </Typography>
        
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 40
          }}
        >
          {sku.description}
        </Typography>

        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {sku.finish_options.slice(0, 3).map((f) => (
            <Chip
              key={f}
              size="small"
              label={f}
              variant="outlined"
              sx={{
                fontSize: "0.7rem",
                height: 24,
                borderColor: "divider"
              }}
            />
          ))}
          {sku.finish_options.length > 3 && (
            <Chip
              size="small"
              label={`+${sku.finish_options.length - 3}`}
              sx={{
                fontSize: "0.7rem",
                height: 24,
                bgcolor: "action.hover"
              }}
            />
          )}
        </Stack>

        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
            ${sku.price_per_kg_usd.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            /kg
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2.5, pt: 0 }}>
        <Button
          component={RouterLink}
          to={`/sku/${sku.id}`}
          fullWidth
          variant="contained"
          sx={{
            fontWeight: 600,
            py: 1.25
          }}
        >
          Choose Options
        </Button>
      </CardActions>
    </Card>
  );
}

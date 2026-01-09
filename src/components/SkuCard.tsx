import { Card, CardContent, CardMedia, Typography, CardActions, Button, Chip, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Sku } from "../lib/database.types";

type Props = {
  sku: Sku;
};

export default function SkuCard({ sku }: Props) {
  return (
    <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {sku.image_url && (
        <CardMedia
          component="img"
          height="160"
          image={sku.image_url}
          alt={sku.name}
          sx={{ objectFit: "cover" }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {sku.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {sku.description}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
          {sku.finish_options.slice(0, 3).map((f) => (
            <Chip key={f} size="small" label={f} variant="outlined" />
          ))}
        </Stack>
        <Typography variant="subtitle1" sx={{ mt: 1.5, fontWeight: 700 }}>
          ${sku.price_per_kg_usd.toFixed(2)}/kg
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          component={RouterLink}
          to={`/sku/${sku.id}`}
          size="small"
          color="primary"
          variant="contained"
          sx={{ fontWeight: 700 }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

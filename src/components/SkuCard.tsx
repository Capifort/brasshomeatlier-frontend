import { Card, CardContent, CardMedia, Typography, CardActions, Button, Chip, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Sku } from "../data/mockData";

type Props = {
  sku: Sku;
};

export default function SkuCard({ sku }: Props) {
  return (
    <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {sku.imageUrl && (
        <CardMedia
          component="img"
          height="160"
          image={sku.imageUrl}
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
          {sku.finishOptions.slice(0, 3).map((f) => (
            <Chip key={f} size="small" label={f} variant="outlined" />
          ))}
        </Stack>
        <Typography variant="subtitle1" sx={{ mt: 1.5, fontWeight: 700 }}>
          ${sku.pricePerKgUsd.toFixed(2)}/kg
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



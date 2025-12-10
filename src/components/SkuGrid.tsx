import { Grid2 as Grid } from "@mui/material";
import type { Sku } from "../data/mockData";
import SkuCard from "./SkuCard";

type Props = {
  skus: Sku[];
};

export default function SkuGrid({ skus }: Props) {
  return (
    <Grid container spacing={2}>
      {skus.map((s) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={s.id}>
          <SkuCard sku={s} />
        </Grid>
      ))}
    </Grid>
  );
}



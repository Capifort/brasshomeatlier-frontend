import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  skuName: string;
};

export default function QuoteDialog({ open, onClose, skuName }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quantityKg, setQuantityKg] = useState<number | "">("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    // For now, just log. In real app, post to API/CRM.
    // eslint-disable-next-line no-console
    console.log({ name, email, quantityKg, notes, skuName, createdAt: new Date().toISOString() });
    onClose();
  };

  const isDisabled = !name || !email || !quantityKg;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Request a Quote</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Tell us about your requirements for <strong>{skuName}</strong>, and we will get back with pricing and lead
          time details.
        </Typography>
        <Stack spacing={2}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} autoFocus fullWidth />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField
            label="Quantity (kg)"
            type="number"
            value={quantityKg}
            onChange={(e) => setQuantityKg(e.target.value === "" ? "" : Number(e.target.value))}
            inputProps={{ min: 1, step: 1 }}
            fullWidth
          />
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            minRows={3}
            multiline
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="text">
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isDisabled} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}



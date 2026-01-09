import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Alert,
  CircularProgress
} from "@mui/material";
import { createQuoteRequest } from "../lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  skuId: string;
  skuName: string;
};

export default function QuoteDialog({ open, onClose, skuId, skuName }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quantityKg, setQuantityKg] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !quantityKg) return;

    setLoading(true);
    setError("");

    try {
      await createQuoteRequest({
        sku_id: skuId,
        sku_name: skuName,
        customer_name: name,
        customer_email: email,
        quantity_kg: Number(quantityKg),
        notes: notes || null
      });
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError("Failed to submit quote request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setQuantityKg("");
    setNotes("");
    setError("");
    setSuccess(false);
    onClose();
  };

  const isDisabled = !name || !email || !quantityKg || loading;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Request a Quote</DialogTitle>
      <DialogContent>
        {success ? (
          <Alert severity="success" sx={{ mt: 1 }}>
            Thank you! Your quote request has been submitted. We'll get back to you soon.
          </Alert>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Tell us about your requirements for <strong>{skuName}</strong>, and we will get back with pricing and lead
              time details.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={2}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                fullWidth
                required
                disabled={loading}
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                disabled={loading}
              />
              <TextField
                label="Quantity (kg)"
                type="number"
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value === "" ? "" : Number(e.target.value))}
                inputProps={{ min: 1, step: 1 }}
                fullWidth
                required
                disabled={loading}
              />
              <TextField
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                minRows={3}
                multiline
                fullWidth
                disabled={loading}
              />
            </Stack>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="text" disabled={loading}>
          {success ? "Close" : "Cancel"}
        </Button>
        {!success && (
          <Button onClick={handleSubmit} disabled={isDisabled} variant="contained">
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

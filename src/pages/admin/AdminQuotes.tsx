import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider
} from "@mui/material";
import { Delete, MoreVert, Visibility, Email } from "@mui/icons-material";
import { getQuoteRequests, updateQuoteRequestStatus, deleteQuoteRequest } from "../../lib/api";
import type { QuoteRequest } from "../../lib/database.types";

const statusColors: Record<QuoteRequest["status"], "warning" | "info" | "success" | "default"> = {
  pending: "warning",
  contacted: "info",
  quoted: "success",
  closed: "default"
};

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const loadQuotes = async () => {
    try {
      const data = await getQuoteRequests();
      setQuotes(data);
    } catch (err) {
      setError("Failed to load quote requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, quote: QuoteRequest) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuote(quote);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = async (status: QuoteRequest["status"]) => {
    if (!selectedQuote) return;
    try {
      await updateQuoteRequestStatus(selectedQuote.id, status);
      setSuccess(`Status updated to ${status}`);
      loadQuotes();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update status");
    }
    handleMenuClose();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quote request?")) return;
    try {
      await deleteQuoteRequest(id);
      setSuccess("Quote request deleted");
      loadQuotes();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete quote request");
    }
    handleMenuClose();
  };

  const handleViewDetails = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setDetailOpen(true);
    handleMenuClose();
  };

  const handleEmailCustomer = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Quote Requests
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : quotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      No quote requests yet
                    </TableCell>
                  </TableRow>
                ) : (
                  quotes.map((quote) => (
                    <TableRow key={quote.id} hover>
                      <TableCell>
                        <Stack>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {quote.customer_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {quote.customer_email}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{quote.sku_name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {quote.quantity_kg} kg
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={quote.status}
                          color={statusColors[quote.status]}
                          size="small"
                          sx={{ fontWeight: 600, textTransform: "capitalize" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(quote.created_at).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleViewDetails(quote)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEmailCustomer(quote.customer_email)}>
                          <Email fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, quote)}>
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleStatusChange("pending")}>
          <Chip label="pending" color="warning" size="small" sx={{ mr: 1 }} /> Mark Pending
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange("contacted")}>
          <Chip label="contacted" color="info" size="small" sx={{ mr: 1 }} /> Mark Contacted
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange("quoted")}>
          <Chip label="quoted" color="success" size="small" sx={{ mr: 1 }} /> Mark Quoted
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange("closed")}>
          <Chip label="closed" color="default" size="small" sx={{ mr: 1 }} /> Mark Closed
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => selectedQuote && handleDelete(selectedQuote.id)} sx={{ color: "error.main" }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Quote Request Details</DialogTitle>
        <DialogContent>
          {selectedQuote && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                <Typography variant="overline" color="text.secondary">
                  Customer Information
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {selectedQuote.customer_name}
                </Typography>
                <Typography variant="body2" color="primary">
                  {selectedQuote.customer_email}
                </Typography>
              </Box>

              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1, p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="overline" color="text.secondary">
                    SKU
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedQuote.sku_name}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="overline" color="text.secondary">
                    Quantity
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedQuote.quantity_kg} kg
                  </Typography>
                </Box>
              </Stack>

              {selectedQuote.notes && (
                <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="overline" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography variant="body1">{selectedQuote.notes}</Typography>
                </Box>
              )}

              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1, p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="overline" color="text.secondary">
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedQuote.status}
                      color={statusColors[selectedQuote.status]}
                      size="small"
                      sx={{ fontWeight: 600, textTransform: "capitalize" }}
                    />
                  </Box>
                </Box>
                <Box sx={{ flex: 1, p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                  <Typography variant="overline" color="text.secondary">
                    Submitted
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {new Date(selectedQuote.created_at).toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailOpen(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<Email />}
            onClick={() => selectedQuote && handleEmailCustomer(selectedQuote.customer_email)}
          >
            Email Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

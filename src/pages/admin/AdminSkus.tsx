import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Avatar,
  MenuItem,
  Chip
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { getSkus, getCategories, createSku, updateSku, deleteSku } from "../../lib/api";
import type { Sku, SkuInsert, Category } from "../../lib/database.types";
import MultiImageUpload from "../../components/MultiImageUpload";
import { useSettings } from "../../contexts/SettingsContext";

export default function AdminSkus() {
  const { settings } = useSettings();
  const [skus, setSkus] = useState<Sku[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSku, setEditingSku] = useState<Sku | null>(null);
  const [formData, setFormData] = useState<SkuInsert>({
    name: "",
    category_id: "",
    description: "",
    price_per_kg_usd: 0,
    min_order_kg: 0,
    lead_time_days: 0,
    finish_options: [],
    material: "Brass",
    image_url: "",
    image_urls: []
  });
  const [finishInput, setFinishInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      const [skuData, categoryData] = await Promise.all([getSkus(), getCategories()]);
      setSkus(skuData);
      setCategories(categoryData);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDialog = (sku?: Sku) => {
    if (sku) {
      setEditingSku(sku);
      setFormData({
        name: sku.name,
        category_id: sku.category_id,
        description: sku.description,
        price_per_kg_usd: sku.price_per_kg_usd,
        min_order_kg: sku.min_order_kg,
        lead_time_days: sku.lead_time_days,
        finish_options: sku.finish_options,
        material: sku.material || "Brass",
        image_url: sku.image_url || "",
        image_urls: sku.image_urls || []
      });
    } else {
      setEditingSku(null);
      setFormData({
        name: "",
        category_id: categories[0]?.id || "",
        description: "",
        price_per_kg_usd: 0,
        min_order_kg: 0,
        lead_time_days: 0,
        finish_options: [],
        material: "Brass",
        image_url: "",
        image_urls: []
      });
    }
    setFinishInput("");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSku(null);
  };

  const handleAddFinish = () => {
    if (finishInput.trim() && !formData.finish_options.includes(finishInput.trim())) {
      setFormData({ ...formData, finish_options: [...formData.finish_options, finishInput.trim()] });
      setFinishInput("");
    }
  };

  const handleRemoveFinish = (finish: string) => {
    setFormData({ ...formData, finish_options: formData.finish_options.filter((f) => f !== finish) });
  };

  const handleSave = async () => {
    try {
      setError("");
      if (!formData.name.trim()) {
        setError("Name is required");
        return;
      }
      if (!formData.category_id) {
        setError("Category is required");
        return;
      }

      if (editingSku) {
        await updateSku(editingSku.id, formData);
        setSuccess("SKU updated successfully");
      } else {
        await createSku(formData);
        setSuccess("SKU created successfully");
      }
      handleCloseDialog();
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save SKU");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this SKU?")) return;
    try {
      await deleteSku(id);
      setSuccess("SKU deleted successfully");
      loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete SKU");
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          SKUs
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add SKU
        </Button>
      </Stack>

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
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Material</TableCell>
                  <TableCell>Price/kg</TableCell>
                  <TableCell>Min Order</TableCell>
                  <TableCell>Lead Time</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : skus.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      No SKUs yet. Create your first one!
                    </TableCell>
                  </TableRow>
                ) : (
                  skus.map((sku) => (
                    <TableRow key={sku.id} hover>
                      <TableCell>
                        <Avatar src={sku.image_url || undefined} variant="rounded" sx={{ width: 48, height: 48 }}>
                          {sku.name[0]}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {sku.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={getCategoryName(sku.category_id)} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {sku.material || "Brass"}
                        </Typography>
                      </TableCell>
                      <TableCell>${sku.price_per_kg_usd.toFixed(2)}</TableCell>
                      <TableCell>{sku.min_order_kg} kg</TableCell>
                      <TableCell>{sku.lead_time_days} days</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleOpenDialog(sku)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(sku.id)}>
                          <Delete fontSize="small" />
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingSku ? "Edit SKU" : "Add SKU"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
                autoFocus
              />
              <TextField
                label="Category"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                select
                fullWidth
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                multiline
                rows={2}
                sx={{ flex: 2 }}
              />
              <TextField
                label="Material"
                value={formData.material || "Brass"}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                select
                fullWidth
                sx={{ flex: 1 }}
              >
                {(settings.materials || []).map((mat) => (
                  <MenuItem key={mat} value={mat}>
                    {mat}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Price per kg (USD)"
                type="number"
                value={formData.price_per_kg_usd}
                onChange={(e) => setFormData({ ...formData, price_per_kg_usd: Number(e.target.value) })}
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
              />
              <TextField
                label="Min Order (kg)"
                type="number"
                value={formData.min_order_kg}
                onChange={(e) => setFormData({ ...formData, min_order_kg: Number(e.target.value) })}
                fullWidth
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Lead Time (days)"
                type="number"
                value={formData.lead_time_days}
                onChange={(e) => setFormData({ ...formData, lead_time_days: Number(e.target.value) })}
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Stack>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Finish Options
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  label="Add Finish Option"
                  value={finishInput}
                  onChange={(e) => setFinishInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFinish())}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <Button variant="outlined" onClick={handleAddFinish}>
                  Add
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                {formData.finish_options.map((finish) => (
                  <Chip key={finish} label={finish} onDelete={() => handleRemoveFinish(finish)} size="small" />
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Product Images
              </Typography>
              <MultiImageUpload
                imageUrls={formData.image_urls || []}
                onImagesChange={(urls) => setFormData({ 
                  ...formData, 
                  image_urls: urls,
                  image_url: urls[0] || "" // First image is the primary
                })}
                folder="skus"
                maxImages={10}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            {editingSku ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

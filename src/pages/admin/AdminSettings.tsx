import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Stack,
  Alert,
  FormControlLabel,
  Divider,
  TextField,
  Button,
  Chip,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSettings } from "../../contexts/SettingsContext";

export default function AdminSettings() {
  const { settings, updateShowPricing, updateMaterials } = useSettings();
  const [showPricing, setShowPricing] = useState(settings.show_pricing);
  const [materials, setMaterials] = useState<string[]>(settings.materials || []);
  const [newMaterial, setNewMaterial] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setShowPricing(settings.show_pricing);
  }, [settings.show_pricing]);

  useEffect(() => {
    setMaterials(settings.materials || []);
  }, [settings.materials]);

  const handleTogglePricing = async (checked: boolean) => {
    setShowPricing(checked);
    await updateShowPricing(checked);
    setSuccess(checked ? "Pricing is now visible" : "Pricing is now hidden");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleAddMaterial = async () => {
    const trimmed = newMaterial.trim();
    if (trimmed && !materials.includes(trimmed)) {
      const updated = [...materials, trimmed];
      setMaterials(updated);
      setNewMaterial("");
      await updateMaterials(updated);
      setSuccess(`"${trimmed}" added to materials`);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleRemoveMaterial = async (material: string) => {
    const updated = materials.filter((m) => m !== material);
    setMaterials(updated);
    await updateMaterials(updated);
    setSuccess(`"${material}" removed from materials`);
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Settings
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Display Settings
          </Typography>

          <Stack spacing={3}>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={showPricing}
                    onChange={(e) => handleTogglePricing(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Show Pricing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      When disabled, all prices will be hidden from the public website.
                      Customers will need to request a quote to get pricing.
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start", ml: 0 }}
              />
            </Box>

            <Divider />

            <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Current Status:</strong>{" "}
                {showPricing ? (
                  <Typography component="span" color="success.main" sx={{ fontWeight: 600 }}>
                    Pricing is visible to customers
                  </Typography>
                ) : (
                  <Typography component="span" color="warning.main" sx={{ fontWeight: 600 }}>
                    Pricing is hidden from customers
                  </Typography>
                )}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Materials Card */}
      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Materials
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Manage the list of materials available when creating SKUs.
          </Typography>

          <Stack spacing={3}>
            {/* Add new material */}
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Add new material"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddMaterial())}
                size="small"
                fullWidth
                placeholder="e.g., Titanium"
              />
              <Button
                variant="contained"
                onClick={handleAddMaterial}
                disabled={!newMaterial.trim() || materials.includes(newMaterial.trim())}
              >
                Add
              </Button>
            </Stack>

            <Divider />

            {/* Materials list */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Available Materials ({materials.length})
              </Typography>
              {materials.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No materials added yet. Add your first material above.
                </Typography>
              ) : (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {materials.map((material) => (
                    <Chip
                      key={material}
                      label={material}
                      onDelete={() => handleRemoveMaterial(material)}
                      deleteIcon={<DeleteIcon />}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

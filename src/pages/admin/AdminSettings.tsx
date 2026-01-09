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
  Divider
} from "@mui/material";
import { useSettings } from "../../contexts/SettingsContext";

export default function AdminSettings() {
  const { settings, updateShowPricing } = useSettings();
  const [showPricing, setShowPricing] = useState(settings.show_pricing);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setShowPricing(settings.show_pricing);
  }, [settings.show_pricing]);

  const handleTogglePricing = async (checked: boolean) => {
    setShowPricing(checked);
    await updateShowPricing(checked);
    setSuccess(checked ? "Pricing is now visible" : "Pricing is now hidden");
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
    </Box>
  );
}

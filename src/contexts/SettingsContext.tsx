import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getSettings, updateSettings, type AppSettings } from "../lib/settings";

interface SettingsContextType {
  settings: AppSettings;
  loading: boolean;
  updateShowPricing: (show: boolean) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  show_pricing: true
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  updateShowPricing: async () => {},
  refreshSettings: async () => {}
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const updateShowPricing = useCallback(async (show: boolean) => {
    try {
      const updated = await updateSettings({ show_pricing: show });
      setSettings(updated);
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, updateShowPricing, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

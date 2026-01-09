import { supabase, isSupabaseConfigured } from "./supabase";

export type AppSettings = {
  show_pricing: boolean;
};

const DEFAULT_SETTINGS: AppSettings = {
  show_pricing: true
};

// Local storage key for settings
const SETTINGS_KEY = "app_settings";

// Mock settings storage for when Supabase is not configured
let mockSettings: AppSettings = { ...DEFAULT_SETTINGS };

// Load from localStorage on init
try {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (saved) {
    mockSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  }
} catch {
  // ignore
}

export async function getSettings(): Promise<AppSettings> {
  if (!isSupabaseConfigured()) {
    return mockSettings;
  }

  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", "app_settings")
      .single();

    if (error || !data) {
      return DEFAULT_SETTINGS;
    }

    return {
      show_pricing: data.show_pricing ?? true
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  const newSettings = { ...mockSettings, ...settings };

  if (!isSupabaseConfigured()) {
    mockSettings = newSettings;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(mockSettings));
    } catch {
      // ignore
    }
    return mockSettings;
  }

  try {
    const { data, error } = await supabase
      .from("settings")
      .upsert({
        id: "app_settings",
        ...newSettings,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return {
      show_pricing: data.show_pricing ?? true
    };
  } catch {
    // Fallback to local storage
    mockSettings = newSettings;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(mockSettings));
    } catch {
      // ignore
    }
    return mockSettings;
  }
}

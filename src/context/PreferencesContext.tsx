import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  THEME_PRESETS,
  COLOR_SCHEMES,
  BUILTIN_FONTS,
  type ThemePresetKey,
  type HomeLayoutKey,
  type ModeKey,
  type FontDefinition,
  type CustomColorsMap,
  type ColorPaletteTokens,
} from "@/lib/theme-presets";
import { loadFont } from "@/lib/font-loader";
import { useAuth } from "@/hooks/use-auth";
import {
  getOrganizationSetting,
  setOrganizationSetting,
  getUserSettings,
  updateUserSettings,
} from "@/lib/db";
import type { Locale } from "@/lib/i18n";

export interface GlobalThemeDefaults {
  defaultTheme: ThemePresetKey;
  defaultMode: ModeKey;
  defaultColorScheme: string;
  defaultFont: string;
  defaultHomeLayout: HomeLayoutKey;
  defaultLanguage: Locale;
}

export interface UserPreferences {
  theme?: ThemePresetKey;
  mode?: ModeKey;
  colorScheme?: string;
  font?: string;
  homeLayout?: HomeLayoutKey;
  language?: Locale;
  customColors?: CustomColorsMap;
}

export interface EffectiveSettings {
  theme: ThemePresetKey;
  mode: ModeKey;
  colorScheme: string;
  font: string;
  homeLayout: HomeLayoutKey;
  language: Locale;
  customColors?: CustomColorsMap;
  isCustom: boolean;
}

export interface PreferencesContextValue {
  preferences: EffectiveSettings;
  userRawPreferences: UserPreferences;
  globalDefaults: GlobalThemeDefaults;
  availableFonts: FontDefinition[];
  isLoading: boolean;
  setTheme: (theme: ThemePresetKey) => Promise<void>;
  setMode: (mode: ModeKey) => Promise<void>;
  setColorScheme: (schemeId: string) => Promise<void>;
  setFont: (fontId: string) => Promise<void>;
  setHomeLayout: (layout: HomeLayoutKey) => Promise<void>;
  setLanguage: (lang: Locale) => Promise<void>;
  setCustomColors: (colors: CustomColorsMap) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  updateGlobalDefaults: (defaults: Partial<GlobalThemeDefaults>) => Promise<void>;
  addCustomFont: (font: FontDefinition) => Promise<void>;
  removeCustomFont: (fontId: string) => Promise<void>;
  refreshPreferences: () => Promise<void>;
}

const LOCAL_STORAGE_KEY = "arsip_user_prefs";
const GLOBAL_SETTINGS_KEY = "theme_defaults";
const CUSTOM_FONTS_KEY = "custom_fonts";

const DEFAULT_GLOBAL: GlobalThemeDefaults = {
  defaultTheme: "paper",
  defaultMode: "light",
  defaultColorScheme: "paper",
  defaultFont: "fraunces",
  defaultHomeLayout: "classic",
  defaultLanguage: "id",
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function getLocalPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserPreferences) : {};
  } catch {
    return {};
  }
}

function setLocalPreferences(prefs: UserPreferences) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

/**
 * Apply token and classes directly to DOM document.documentElement
 */
function applyTokensToDOM(settings: EffectiveSettings, fontDef: FontDefinition) {
  const root = document.documentElement;

  // 1. Light/Dark mode class
  if (settings.mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  // 2. Data attributes
  root.setAttribute("data-theme", settings.theme);
  root.setAttribute("data-color-scheme", settings.colorScheme);
  root.setAttribute("data-layout", settings.homeLayout);

  // 3. Fonts
  root.style.setProperty("--font-display", fontDef.fontDisplay);
  root.style.setProperty("--font-serif", fontDef.fontSans);
  root.style.setProperty("--font-sans", fontDef.fontSans);
  root.style.setProperty("--font-mono", fontDef.fontMono);

  // 4. Color Palette Variables
  let basePalette: ColorPaletteTokens | undefined;
  const scheme = COLOR_SCHEMES[settings.colorScheme] || COLOR_SCHEMES.paper;
  basePalette = settings.mode === "dark" && scheme.dark ? scheme.dark : scheme.light;

  // Apply base tokens
  if (basePalette) {
    Object.entries(basePalette).forEach(([token, val]) => {
      if (val !== undefined) {
        // Map camelCase to kebab-case
        const cssVar = `--${token.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
        root.style.setProperty(cssVar, String(val));
      }
    });
  }

  // Apply custom overrides if customColors exists
  if (settings.customColors) {
    const customModeOverrides =
      settings.mode === "dark"
        ? settings.customColors.dark
        : settings.customColors.light;

    if (customModeOverrides) {
      Object.entries(customModeOverrides).forEach(([token, val]) => {
        if (val) {
          const cssVar = `--${token.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
          root.style.setProperty(cssVar, String(val));
        }
      });
    }
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [globalDefaults, setGlobalDefaults] = useState<GlobalThemeDefaults>(DEFAULT_GLOBAL);
  const [availableFonts, setAvailableFonts] = useState<FontDefinition[]>(BUILTIN_FONTS);
  const [userPrefs, setUserPrefs] = useState<UserPreferences>(getLocalPreferences());
  const [isLoading, setIsLoading] = useState(true);

  // Load global defaults and custom fonts from Supabase
  const loadGlobalData = useCallback(async () => {
    try {
      const [storedDefaults, customFonts] = await Promise.all([
        getOrganizationSetting<GlobalThemeDefaults>(GLOBAL_SETTINGS_KEY),
        getOrganizationSetting<FontDefinition[]>(CUSTOM_FONTS_KEY),
      ]);

      if (storedDefaults) {
        setGlobalDefaults({ ...DEFAULT_GLOBAL, ...storedDefaults });
      }

      if (customFonts && Array.isArray(customFonts)) {
        const combined = [...BUILTIN_FONTS];
        customFonts.forEach((cf) => {
          if (!combined.some((bf) => bf.id === cf.id)) {
            combined.push(cf);
          }
        });
        setAvailableFonts(combined);
      }
    } catch (err) {
      console.warn("[Preferences] Fallback to local global defaults:", err);
    }
  }, []);

  // Load user preferences from Supabase (or localStorage fallback)
  const loadUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (user && !user.guest) {
        const dbSettings = await getUserSettings<UserPreferences>(user.id);
        if (dbSettings) {
          setUserPrefs(dbSettings);
          setLocalPreferences(dbSettings);
        } else {
          setUserPrefs(getLocalPreferences());
        }
      } else {
        setUserPrefs(getLocalPreferences());
      }
    } catch {
      setUserPrefs(getLocalPreferences());
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadGlobalData();
  }, [loadGlobalData]);

  useEffect(() => {
    void loadUserData();
  }, [loadUserData]);

  // Resolve Effective Settings & Custom Transitions
  const effectiveSettings = useMemo<EffectiveSettings>(() => {
    const rawTheme = userPrefs.theme ?? globalDefaults.defaultTheme;
    let rawMode = userPrefs.mode ?? globalDefaults.defaultMode;
    const rawScheme = userPrefs.colorScheme ?? (rawTheme !== "custom" ? rawTheme : globalDefaults.defaultColorScheme);
    const rawFont = userPrefs.font ?? globalDefaults.defaultFont;
    const rawLayout = userPrefs.homeLayout ?? globalDefaults.defaultHomeLayout;
    const rawLang = userPrefs.language ?? globalDefaults.defaultLanguage;

    // CARTOON DARK-MODE LOCK: Cartoon theme or color scheme NEVER supports dark mode
    if (rawTheme === "cartoon" || rawScheme === "cartoon") {
      rawMode = "light";
    }

    // Custom Theme Transition Logic:
    // If active theme is marked as a preset, verify whether user deviations exist
    let effectiveTheme: ThemePresetKey = rawTheme;
    let isCustom = rawTheme === "custom";

    if (rawTheme !== "custom") {
      const preset = THEME_PRESETS[rawTheme];
      if (preset) {
        const schemeMismatch = rawScheme !== preset.colorScheme;
        const fontMismatch = rawFont !== preset.fontFamily;
        const layoutMismatch = rawLayout !== preset.homeLayout;
        const hasCustomColors =
          Boolean(userPrefs.customColors?.light && Object.keys(userPrefs.customColors.light).length > 0) ||
          Boolean(userPrefs.customColors?.dark && Object.keys(userPrefs.customColors.dark).length > 0);

        if (schemeMismatch || fontMismatch || layoutMismatch || hasCustomColors) {
          effectiveTheme = "custom";
          isCustom = true;
        }
      }
    }

    return {
      theme: effectiveTheme,
      mode: rawMode,
      colorScheme: rawScheme,
      font: rawFont,
      homeLayout: rawLayout,
      language: rawLang,
      customColors: userPrefs.customColors,
      isCustom,
    };
  }, [userPrefs, globalDefaults]);

  // Apply to DOM on change
  useEffect(() => {
    const activeFont =
      availableFonts.find((f) => f.id === effectiveSettings.font) || BUILTIN_FONTS[0];
    loadFont(activeFont);
    applyTokensToDOM(effectiveSettings, activeFont);
  }, [effectiveSettings, availableFonts]);

  // Persistence handler
  const savePreferences = async (newPrefs: UserPreferences) => {
    setUserPrefs(newPrefs);
    setLocalPreferences(newPrefs);

    if (user && !user.guest) {
      try {
        await updateUserSettings(user.id, newPrefs);
      } catch (err) {
        console.warn("[Preferences] DB save failed, saved locally:", err);
      }
    }
  };

  // Helper actions
  const setTheme = async (presetKey: ThemePresetKey) => {
    if (presetKey === "custom") {
      await savePreferences({
        ...userPrefs,
        theme: "custom",
      });
      return;
    }

    const preset = THEME_PRESETS[presetKey];
    if (!preset) return;

    // Reset settings to match chosen preset exactly
    await savePreferences({
      ...userPrefs,
      theme: presetKey,
      mode: preset.defaultMode,
      colorScheme: preset.colorScheme,
      font: preset.fontFamily,
      homeLayout: preset.homeLayout,
      customColors: undefined,
    });
  };

  const setMode = async (mode: ModeKey) => {
    // If cartoon is active, lock to light
    if (effectiveSettings.theme === "cartoon" || effectiveSettings.colorScheme === "cartoon") {
      return;
    }
    await savePreferences({
      ...userPrefs,
      mode,
    });
  };

  const setColorScheme = async (schemeId: string) => {
    await savePreferences({
      ...userPrefs,
      colorScheme: schemeId,
    });
  };

  const setFont = async (fontId: string) => {
    await savePreferences({
      ...userPrefs,
      font: fontId,
    });
  };

  const setHomeLayout = async (layout: HomeLayoutKey) => {
    await savePreferences({
      ...userPrefs,
      homeLayout: layout,
    });
  };

  const setLanguage = async (language: Locale) => {
    await savePreferences({
      ...userPrefs,
      language,
    });
  };

  const setCustomColors = async (customColors: CustomColorsMap) => {
    await savePreferences({
      ...userPrefs,
      customColors,
      colorScheme: "custom",
    });
  };

  const resetToDefaults = async () => {
    const empty: UserPreferences = {};
    setUserPrefs(empty);
    setLocalPreferences(empty);
    if (user && !user.guest) {
      try {
        await updateUserSettings(user.id, empty);
      } catch (err) {
        console.warn("[Preferences] DB reset failed:", err);
      }
    }
  };

  const updateGlobalDefaults = async (updated: Partial<GlobalThemeDefaults>) => {
    const next: GlobalThemeDefaults = {
      ...globalDefaults,
      ...updated,
    };
    setGlobalDefaults(next);
    await setOrganizationSetting(GLOBAL_SETTINGS_KEY, next);
  };

  const addCustomFont = async (newFont: FontDefinition) => {
    const nextFonts = [...availableFonts.filter((f) => f.id !== newFont.id), newFont];
    setAvailableFonts(nextFonts);

    // Persist only non-builtin custom fonts to Supabase
    const customOnly = nextFonts.filter((f) => !f.isBuiltIn);
    await setOrganizationSetting(CUSTOM_FONTS_KEY, customOnly);
  };

  const removeCustomFont = async (fontId: string) => {
    const nextFonts = availableFonts.filter((f) => f.id !== fontId || f.isBuiltIn);
    setAvailableFonts(nextFonts);

    const customOnly = nextFonts.filter((f) => !f.isBuiltIn);
    await setOrganizationSetting(CUSTOM_FONTS_KEY, customOnly);
  };

  const value: PreferencesContextValue = {
    preferences: effectiveSettings,
    userRawPreferences: userPrefs,
    globalDefaults,
    availableFonts,
    isLoading,
    setTheme,
    setMode,
    setColorScheme,
    setFont,
    setHomeLayout,
    setLanguage,
    setCustomColors,
    resetToDefaults,
    updateGlobalDefaults,
    addCustomFont,
    removeCustomFont,
    refreshPreferences: async () => {
      await Promise.all([loadGlobalData(), loadUserData()]);
    },
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return ctx;
}

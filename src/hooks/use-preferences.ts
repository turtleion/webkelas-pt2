export { usePreferences } from "@/context/PreferencesContext";
export type {
  GlobalThemeDefaults,
  UserPreferences,
  EffectiveSettings,
  PreferencesContextValue,
} from "@/context/PreferencesContext";
export type {
  ThemePresetKey,
  HomeLayoutKey,
  ModeKey,
  FontDefinition,
  CustomColorsMap,
  ColorPaletteTokens,
  BackgroundPreset,
} from "@/lib/theme-presets";
export {
  BACKGROUND_PRESETS,
  getBackgroundsForTheme,
  getBackgroundById,
} from "@/lib/theme-presets";

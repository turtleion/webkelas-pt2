export type ThemePresetKey = "paper" | "glass" | "cartoon" | "custom";
export type HomeLayoutKey = "classic" | "bento" | "showcase";
export type ModeKey = "light" | "dark";

export interface ColorPaletteTokens {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  radius: string;
  // Glass specific
  glassBg?: string;
  glassBgStrong?: string;
  glassBorder?: string;
  glassBorderBright?: string;
  glassHighlight?: string;
  glassShadow?: string;
  glassShadowHover?: string;
}

export interface PresetColorScheme {
  id: string;
  name: string;
  light: ColorPaletteTokens;
  dark?: ColorPaletteTokens; // Cartoon is light only
}

export interface ThemeConfig {
  name: string;
  presetKey: ThemePresetKey;
  supportedModes: ModeKey[];
  defaultMode: ModeKey;
  colorScheme: string;
  fontFamily: string;
  homeLayout: HomeLayoutKey;
  borderRadius: string;
  glassBlur: boolean;
  paperGrain: boolean;
  borderStyle: "solid" | "double" | "bold-cartoon";
}

export interface CustomColorsMap {
  light?: Partial<ColorPaletteTokens>;
  dark?: Partial<ColorPaletteTokens>;
}

export interface FontDefinition {
  id: string;
  name: string;
  fontDisplay: string;
  fontSans: string;
  fontMono: string;
  googleFont?: string; // Query string for Google Fonts URL
  isBuiltIn?: boolean;
}

// ---------------------------------------------------------------------------
// Built-in Font Registry
// ---------------------------------------------------------------------------
export const BUILTIN_FONTS: FontDefinition[] = [
  {
    id: "fraunces",
    name: "Fraunces & IBM Plex Mono",
    fontDisplay: '"Fraunces", Georgia, serif',
    fontSans: '"Fraunces", Georgia, serif',
    fontMono: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
    isBuiltIn: true,
  },
  {
    id: "plus-jakarta",
    name: "Plus Jakarta Sans",
    fontDisplay: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    fontSans: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    fontMono: '"IBM Plex Mono", ui-monospace, monospace',
    googleFont: "Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400",
    isBuiltIn: true,
  },
  {
    id: "space-grotesk",
    name: "Space Grotesk",
    fontDisplay: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
    fontSans: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
    fontMono: '"Space Mono", ui-monospace, monospace',
    googleFont: "Space+Grotesk:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700",
    isBuiltIn: true,
  },
];

// ---------------------------------------------------------------------------
// Built-in Color Schemes
// ---------------------------------------------------------------------------
export const COLOR_SCHEMES: Record<string, PresetColorScheme> = {
  paper: {
    id: "paper",
    name: "Paper",
    light: {
      radius: "0.25rem",
      background: "#f4eddd",
      foreground: "#29241d",
      card: "#ece2cb",
      cardForeground: "#29241d",
      popover: "#f4eddd",
      popoverForeground: "#29241d",
      primary: "#2e4631",
      primaryForeground: "#f2ead7",
      secondary: "#e7dcc2",
      secondaryForeground: "#29241d",
      muted: "#ebe1c9",
      mutedForeground: "#6d6250",
      accent: "#a64f2b",
      accentForeground: "#f7f1e2",
      destructive: "#8f3b24",
      border: "#d2c3a2",
      input: "#d2c3a2",
      ring: "#2e4631",
      glassBg: "rgba(250, 247, 240, 0.6)",
      glassBgStrong: "rgba(252, 249, 242, 0.88)",
      glassBorder: "rgba(46, 70, 49, 0.18)",
      glassBorderBright: "rgba(46, 70, 49, 0.34)",
      glassHighlight: "rgba(255, 255, 255, 0.7)",
      glassShadow: "0 1px 1px rgba(41, 36, 29, 0.05), 0 10px 30px -18px rgba(41, 36, 29, 0.28)",
      glassShadowHover: "0 2px 2px rgba(41, 36, 29, 0.05), 0 18px 44px -20px rgba(41, 36, 29, 0.38)",
    },
    dark: {
      radius: "0.25rem",
      background: "#1e1a12",
      foreground: "#e7dcc1",
      card: "#272216",
      cardForeground: "#e7dcc1",
      popover: "#1e1a12",
      popoverForeground: "#e7dcc1",
      primary: "#9db392",
      primaryForeground: "#1e1a12",
      secondary: "#322b1a",
      secondaryForeground: "#e7dcc1",
      muted: "#2a2416",
      mutedForeground: "#a99b7d",
      accent: "#c96a41",
      accentForeground: "#1e1a12",
      destructive: "#c25a35",
      border: "#3a3120",
      input: "#3a3120",
      ring: "#9db392",
      glassBg: "rgba(39, 34, 22, 0.58)",
      glassBgStrong: "rgba(39, 34, 22, 0.88)",
      glassBorder: "rgba(157, 179, 146, 0.16)",
      glassBorderBright: "rgba(157, 179, 146, 0.32)",
      glassHighlight: "rgba(231, 220, 193, 0.09)",
      glassShadow: "0 1px 1px rgba(0, 0, 0, 0.28), 0 12px 32px -18px rgba(0, 0, 0, 0.55)",
      glassShadowHover: "0 2px 2px rgba(0, 0, 0, 0.28), 0 20px 48px -20px rgba(0, 0, 0, 0.65)",
    },
  },
  glass: {
    id: "glass",
    name: "Glass",
    light: {
      radius: "0.75rem",
      background: "#f0f4f8",
      foreground: "#0f172a",
      card: "rgba(255, 255, 255, 0.75)",
      cardForeground: "#0f172a",
      popover: "rgba(255, 255, 255, 0.9)",
      popoverForeground: "#0f172a",
      primary: "#0284c7",
      primaryForeground: "#ffffff",
      secondary: "#e2e8f0",
      secondaryForeground: "#0f172a",
      muted: "#f1f5f9",
      mutedForeground: "#64748b",
      accent: "#0ea5e9",
      accentForeground: "#ffffff",
      destructive: "#ef4444",
      border: "rgba(2, 132, 199, 0.18)",
      input: "rgba(2, 132, 199, 0.22)",
      ring: "#0284c7",
      glassBg: "rgba(255, 255, 255, 0.65)",
      glassBgStrong: "rgba(255, 255, 255, 0.88)",
      glassBorder: "rgba(2, 132, 199, 0.22)",
      glassBorderBright: "rgba(2, 132, 199, 0.45)",
      glassHighlight: "rgba(255, 255, 255, 0.9)",
      glassShadow: "0 4px 20px -2px rgba(2, 132, 199, 0.12)",
      glassShadowHover: "0 8px 30px -4px rgba(2, 132, 199, 0.22)",
    },
    dark: {
      radius: "0.75rem",
      background: "#0b1320",
      foreground: "#f1f5f9",
      card: "rgba(15, 23, 42, 0.75)",
      cardForeground: "#f1f5f9",
      popover: "rgba(15, 23, 42, 0.9)",
      popoverForeground: "#f1f5f9",
      primary: "#38bdf8",
      primaryForeground: "#0b1320",
      secondary: "#1e293b",
      secondaryForeground: "#f1f5f9",
      muted: "#172554",
      mutedForeground: "#94a3b8",
      accent: "#7dd3fc",
      accentForeground: "#0b1320",
      destructive: "#f87171",
      border: "rgba(56, 189, 248, 0.2)",
      input: "rgba(56, 189, 248, 0.25)",
      ring: "#38bdf8",
      glassBg: "rgba(15, 23, 42, 0.65)",
      glassBgStrong: "rgba(15, 23, 42, 0.88)",
      glassBorder: "rgba(56, 189, 248, 0.25)",
      glassBorderBright: "rgba(56, 189, 248, 0.5)",
      glassHighlight: "rgba(255, 255, 255, 0.1)",
      glassShadow: "0 4px 24px -2px rgba(0, 0, 0, 0.5)",
      glassShadowHover: "0 8px 32px -4px rgba(56, 189, 248, 0.25)",
    },
  },
  cartoon: {
    id: "cartoon",
    name: "Cartoon",
    light: {
      radius: "0.875rem",
      background: "#fffbeb",
      foreground: "#18181b",
      card: "#ffffff",
      cardForeground: "#18181b",
      popover: "#ffffff",
      popoverForeground: "#18181b",
      primary: "#f59e0b",
      primaryForeground: "#18181b",
      secondary: "#fed7aa",
      secondaryForeground: "#18181b",
      muted: "#fef3c7",
      mutedForeground: "#78716c",
      accent: "#f43f5e",
      accentForeground: "#ffffff",
      destructive: "#dc2626",
      border: "#18181b",
      input: "#18181b",
      ring: "#f59e0b",
      glassBg: "rgba(255, 255, 255, 0.95)",
      glassBgStrong: "rgba(255, 255, 255, 1)",
      glassBorder: "#18181b",
      glassBorderBright: "#18181b",
      glassHighlight: "rgba(255, 255, 255, 1)",
      glassShadow: "4px 4px 0px #18181b",
      glassShadowHover: "6px 6px 0px #18181b",
    },
  },
};

// ---------------------------------------------------------------------------
// Theme Presets Configuration
// ---------------------------------------------------------------------------
export const THEME_PRESETS: Record<ThemePresetKey, ThemeConfig> = {
  paper: {
    name: "Paper",
    presetKey: "paper",
    supportedModes: ["light", "dark"],
    defaultMode: "light",
    colorScheme: "paper",
    fontFamily: "fraunces",
    homeLayout: "classic",
    borderRadius: "0.25rem",
    glassBlur: true,
    paperGrain: true,
    borderStyle: "double",
  },
  glass: {
    name: "Glass",
    presetKey: "glass",
    supportedModes: ["light", "dark"],
    defaultMode: "light",
    colorScheme: "glass",
    fontFamily: "plus-jakarta",
    homeLayout: "bento",
    borderRadius: "0.75rem",
    glassBlur: true,
    paperGrain: false,
    borderStyle: "solid",
  },
  cartoon: {
    name: "Cartoon",
    presetKey: "cartoon",
    supportedModes: ["light"], // STRICTLY LIGHT ONLY
    defaultMode: "light",
    colorScheme: "cartoon",
    fontFamily: "space-grotesk",
    homeLayout: "showcase",
    borderRadius: "0.875rem",
    glassBlur: false,
    paperGrain: false,
    borderStyle: "bold-cartoon",
  },
  custom: {
    name: "Custom",
    presetKey: "custom",
    supportedModes: ["light", "dark"],
    defaultMode: "light",
    colorScheme: "custom",
    fontFamily: "fraunces",
    homeLayout: "classic",
    borderRadius: "0.375rem",
    glassBlur: true,
    paperGrain: false,
    borderStyle: "solid",
  },
};

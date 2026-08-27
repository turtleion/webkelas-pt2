export type ThemePresetKey =
  | "paper"
  | "glass"
  | "cartoon"
  | "dreamy"
  | "minimalistic"
  | "custom";
export type HomeLayoutKey = "classic" | "bento" | "showcase" | "modern" | "experimental" | "nature";
export type ModeKey = "light" | "dark";

export interface ColorPaletteTokens {
  // Core & Content
  background: string;
  foreground: string; // onBackground
  primary: string;
  primaryForeground: string; // onPrimary
  accent: string;
  accentForeground: string; // onAccent

  // Surface & Content
  card: string; // surface
  cardForeground: string; // onSurface
  popover: string;
  popoverForeground: string;

  // Navigation
  nav: string;
  onNav: string;

  // Optional Tertiary
  tertiary?: string;
  onTertiary?: string;

  // UI Support
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  radius: string;

  // Glass specific tokens
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
  defaultBackground: string; // id of the default background preset
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
  {
    id: "quicksand",
    name: "Quicksand",
    fontDisplay: '"Quicksand", ui-sans-serif, system-ui, sans-serif',
    fontSans: '"Quicksand", ui-sans-serif, system-ui, sans-serif',
    fontMono: '"IBM Plex Mono", ui-monospace, monospace',
    googleFont: "Quicksand:wght@400;500;600;700",
    isBuiltIn: true,
  },
];

// ---------------------------------------------------------------------------
// Built-in Color Schemes (Paper, Glass, Cartoon)
// ---------------------------------------------------------------------------
export const COLOR_SCHEMES: Record<string, PresetColorScheme> = {
  paper: {
    id: "paper",
    name: "Paper",
    light: {
      radius: "0.25rem",
      background: "#f4eddd",
      foreground: "#29241d",
      primary: "#2e4631",
      primaryForeground: "#f2ead7",
      accent: "#a64f2b",
      accentForeground: "#f7f1e2",
      card: "#ece2cb",
      cardForeground: "#29241d",
      popover: "#f4eddd",
      popoverForeground: "#29241d",
      nav: "#ece2cb",
      onNav: "#29241d",
      tertiary: "#7a5c2b",
      onTertiary: "#f7f1e2",
      secondary: "#e7dcc2",
      secondaryForeground: "#29241d",
      muted: "#ebe1c9",
      mutedForeground: "#6d6250",
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
      primary: "#9db392",
      primaryForeground: "#1e1a12",
      accent: "#c96a41",
      accentForeground: "#1e1a12",
      card: "#272216",
      cardForeground: "#e7dcc1",
      popover: "#1e1a12",
      popoverForeground: "#e7dcc1",
      nav: "#272216",
      onNav: "#e7dcc1",
      tertiary: "#b08d57",
      onTertiary: "#1e1a12",
      secondary: "#322b1a",
      secondaryForeground: "#e7dcc1",
      muted: "#2a2416",
      mutedForeground: "#a99b7d",
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
      primary: "#0284c7",
      primaryForeground: "#ffffff",
      accent: "#0ea5e9",
      accentForeground: "#ffffff",
      card: "rgba(255, 255, 255, 0.75)",
      cardForeground: "#0f172a",
      popover: "rgba(255, 255, 255, 0.9)",
      popoverForeground: "#0f172a",
      nav: "rgba(255, 255, 255, 0.7)",
      onNav: "#0f172a",
      tertiary: "#6366f1",
      onTertiary: "#ffffff",
      secondary: "#e2e8f0",
      secondaryForeground: "#0f172a",
      muted: "#f1f5f9",
      mutedForeground: "#64748b",
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
      primary: "#38bdf8",
      primaryForeground: "#0b1320",
      accent: "#7dd3fc",
      accentForeground: "#0b1320",
      card: "rgba(15, 23, 42, 0.75)",
      cardForeground: "#f1f5f9",
      popover: "rgba(15, 23, 42, 0.9)",
      popoverForeground: "#f1f5f9",
      nav: "rgba(15, 23, 42, 0.75)",
      onNav: "#f1f5f9",
      tertiary: "#818cf8",
      onTertiary: "#0b1320",
      secondary: "#1e293b",
      secondaryForeground: "#f1f5f9",
      muted: "#172554",
      mutedForeground: "#94a3b8",
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
      primary: "#f59e0b",
      primaryForeground: "#18181b",
      accent: "#f43f5e",
      accentForeground: "#ffffff",
      card: "#ffffff",
      cardForeground: "#18181b",
      popover: "#ffffff",
      popoverForeground: "#18181b",
      nav: "#fffbeb",
      onNav: "#18181b",
      tertiary: "#38bdf8",
      onTertiary: "#18181b",
      secondary: "#fed7aa",
      secondaryForeground: "#18181b",
      muted: "#fef3c7",
      mutedForeground: "#78716c",
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
  dreamy: {
    id: "dreamy",
    name: "Dreamy",
    light: {
      radius: "1rem",
      background: "#f3f1fb",
      foreground: "#3e3a5c",
      primary: "#8f86d9",
      primaryForeground: "#ffffff",
      accent: "#c9a5d6",
      accentForeground: "#3e2a52",
      card: "#ffffff",
      cardForeground: "#3e3a5c",
      popover: "#ffffff",
      popoverForeground: "#3e3a5c",
      nav: "#ebe8f9",
      onNav: "#3e3a5c",
      tertiary: "#a7c7e7",
      onTertiary: "#22324a",
      secondary: "#e3ddf6",
      secondaryForeground: "#3e3a5c",
      muted: "#ece9f8",
      mutedForeground: "#8a86ac",
      destructive: "#d98aa8",
      border: "#e0dbf3",
      input: "#e0dbf3",
      ring: "#8f86d9",
      glassBg: "rgba(255, 255, 255, 0.42)",
      glassBgStrong: "rgba(255, 255, 255, 0.62)",
      glassBorder: "rgba(143, 134, 217, 0.24)",
      glassBorderBright: "rgba(201, 165, 214, 0.4)",
      glassHighlight: "rgba(255, 255, 255, 0.7)",
      glassShadow: "0 8px 40px -12px rgba(120, 110, 200, 0.25)",
      glassShadowHover: "0 14px 52px -16px rgba(120, 110, 200, 0.35)",
    },
    dark: {
      radius: "1rem",
      background: "#17142e",
      foreground: "#dcd8f2",
      primary: "#a79ef0",
      primaryForeground: "#17142e",
      accent: "#c9a5d6",
      accentForeground: "#f4edfb",
      card: "#221c40",
      cardForeground: "#dcd8f2",
      popover: "#1c1834",
      popoverForeground: "#dcd8f2",
      nav: "#1e1940",
      onNav: "#dcd8f2",
      tertiary: "#7f9fd3",
      onTertiary: "#0f1222",
      secondary: "#2c2652",
      secondaryForeground: "#dcd8f2",
      muted: "#241f47",
      mutedForeground: "#9b95c4",
      destructive: "#c97ca0",
      border: "#342d63",
      input: "#342d63",
      ring: "#a79ef0",
      glassBg: "rgba(40, 34, 84, 0.45)",
      glassBgStrong: "rgba(40, 34, 84, 0.66)",
      glassBorder: "rgba(167, 158, 240, 0.22)",
      glassBorderBright: "rgba(201, 165, 214, 0.35)",
      glassHighlight: "rgba(220, 216, 242, 0.08)",
      glassShadow: "0 8px 40px -12px rgba(0, 0, 0, 0.4)",
      glassShadowHover: "0 14px 52px -16px rgba(0, 0, 0, 0.55)",
    },
  },
  minimalistic: {
    id: "minimalistic",
    name: "Minimalistic",
    light: {
      radius: "0.375rem",
      background: "#ffffff",
      foreground: "#111827",
      primary: "#111827",
      primaryForeground: "#ffffff",
      accent: "#6b7280",
      accentForeground: "#ffffff",
      card: "#ffffff",
      cardForeground: "#111827",
      popover: "#ffffff",
      popoverForeground: "#111827",
      nav: "#f9fafb",
      onNav: "#111827",
      tertiary: "#9ca3af",
      onTertiary: "#111827",
      secondary: "#f3f4f6",
      secondaryForeground: "#111827",
      muted: "#f3f4f6",
      mutedForeground: "#6b7280",
      destructive: "#b91c1c",
      border: "#e5e7eb",
      input: "#d1d5db",
      ring: "#111827",
      glassBg: "rgba(255, 255, 255, 0.6)",
      glassBgStrong: "rgba(255, 255, 255, 0.92)",
      glassBorder: "rgba(17, 24, 39, 0.08)",
      glassBorderBright: "rgba(17, 24, 39, 0.16)",
      glassHighlight: "rgba(255, 255, 255, 0.8)",
      glassShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
      glassShadowHover: "0 4px 12px -2px rgba(0, 0, 0, 0.08)",
    },
    dark: {
      radius: "0.375rem",
      background: "#0b0b0d",
      foreground: "#e5e7eb",
      primary: "#e5e7eb",
      primaryForeground: "#0b0b0d",
      accent: "#9ca3af",
      accentForeground: "#0b0b0d",
      card: "#151517",
      cardForeground: "#e5e7eb",
      popover: "#111113",
      popoverForeground: "#e5e7eb",
      nav: "#101012",
      onNav: "#e5e7eb",
      tertiary: "#6b7280",
      onTertiary: "#f9fafb",
      secondary: "#1c1c1f",
      secondaryForeground: "#e5e7eb",
      muted: "#1a1a1d",
      mutedForeground: "#9ca3af",
      destructive: "#ef4444",
      border: "#26262b",
      input: "#33333a",
      ring: "#e5e7eb",
      glassBg: "rgba(21, 21, 23, 0.6)",
      glassBgStrong: "rgba(21, 21, 23, 0.92)",
      glassBorder: "rgba(229, 231, 235, 0.08)",
      glassBorderBright: "rgba(229, 231, 235, 0.16)",
      glassHighlight: "rgba(255, 255, 255, 0.05)",
      glassShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
      glassShadowHover: "0 4px 12px -2px rgba(0, 0, 0, 0.5)",
    },
  },
};

// ---------------------------------------------------------------------------
// Background Presets (15 Logical Presets with Light & Dark Variants)
// ---------------------------------------------------------------------------
export interface BackgroundVariant {
  css: string;
  thumbnail: string;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  theme: ThemePresetKey;
  light: BackgroundVariant;
  dark: BackgroundVariant;
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  // ── Paper Backgrounds (5) ──────────────────────────────────────────
  {
    id: "paper-classic",
    name: "Classic Parchment",
    theme: "paper",
    light: {
      css: `
        radial-gradient(120% 60% at 50% -5%, rgba(255,255,255,0.55), transparent 55%),
        radial-gradient(90% 45% at 50% 108%, rgba(122,92,43,0.08), transparent 60%),
        linear-gradient(#f4eddd, #f4eddd)
      `,
      thumbnail: "linear-gradient(170deg, #f4eddd 0%, #e8dcc4 100%)",
    },
    dark: {
      css: `
        radial-gradient(120% 60% at 50% -5%, rgba(255,255,255,0.04), transparent 55%),
        radial-gradient(90% 45% at 50% 108%, rgba(0,0,0,0.5), transparent 60%),
        linear-gradient(#1b1710, #1b1710)
      `,
      thumbnail: "linear-gradient(170deg, #241f17 0%, #15120d 100%)",
    },
  },
  {
    id: "paper-warm-linen",
    name: "Warm Linen",
    theme: "paper",
    light: {
      css: `
        repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(210,195,162,0.18) 24px, rgba(210,195,162,0.18) 25px),
        radial-gradient(ellipse at 30% 20%, rgba(196,168,120,0.15), transparent 60%),
        linear-gradient(#f0e7d2, #f0e7d2)
      `,
      thumbnail: "linear-gradient(180deg, #f0e7d2 0%, #e5d9bf 50%, #f0e7d2 100%)",
    },
    dark: {
      css: `
        repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,0.03) 24px, rgba(255,255,255,0.03) 25px),
        radial-gradient(ellipse at 30% 20%, rgba(157,179,146,0.06), transparent 60%),
        linear-gradient(#16130e, #16130e)
      `,
      thumbnail: "linear-gradient(180deg, #211c14 0%, #17140e 50%, #12100b 100%)",
    },
  },
  {
    id: "paper-aged-manuscript",
    name: "Aged Manuscript",
    theme: "paper",
    light: {
      css: `
        radial-gradient(ellipse at 80% 15%, rgba(166,79,43,0.08), transparent 50%),
        radial-gradient(ellipse at 20% 85%, rgba(46,70,49,0.06), transparent 50%),
        linear-gradient(180deg, #f2e8d0 0%, #ede0c4 40%, #e8d8b8 100%)
      `,
      thumbnail: "linear-gradient(180deg, #f2e8d0 0%, #e8d8b8 100%)",
    },
    dark: {
      css: `
        radial-gradient(ellipse at 80% 15%, rgba(201,106,65,0.09), transparent 50%),
        radial-gradient(ellipse at 20% 85%, rgba(157,179,146,0.06), transparent 50%),
        linear-gradient(180deg, #221c13 0%, #1b160e 50%, #14100a 100%)
      `,
      thumbnail: "linear-gradient(180deg, #262016 0%, #14100a 100%)",
    },
  },
  {
    id: "paper-sepia-vignette",
    name: "Sepia Vignette",
    theme: "paper",
    light: {
      css: `
        radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(120,88,44,0.1) 100%),
        radial-gradient(circle at 50% 0%, rgba(255,255,255,0.45), transparent 60%),
        linear-gradient(#f5edd8, #f5edd8)
      `,
      thumbnail: "radial-gradient(ellipse at 50% 50%, #f5edd8 40%, #e2d5b8 100%)",
    },
    dark: {
      css: `
        radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%),
        radial-gradient(circle at 50% 0%, rgba(201,106,65,0.05), transparent 60%),
        linear-gradient(#19150f, #19150f)
      `,
      thumbnail: "radial-gradient(ellipse at 50% 50%, #241d14 40%, #0d0a07 100%)",
    },
  },
  {
    id: "paper-library-desk",
    name: "Library Study",
    theme: "paper",
    light: {
      css: `
        radial-gradient(circle at 70% 30%, rgba(46,70,49,0.07), transparent 45%),
        radial-gradient(circle at 30% 70%, rgba(166,79,43,0.05), transparent 50%),
        linear-gradient(135deg, #f7f1e3 0%, #eedfca 100%)
      `,
      thumbnail: "linear-gradient(135deg, #f7f1e3 0%, #e5d4bc 100%)",
    },
    dark: {
      css: `
        radial-gradient(circle at 70% 30%, rgba(157,179,146,0.08), transparent 45%),
        radial-gradient(circle at 30% 70%, rgba(201,106,65,0.06), transparent 50%),
        linear-gradient(135deg, #1e1912 0%, #120f0a 100%)
      `,
      thumbnail: "linear-gradient(135deg, #251e16 0%, #110e09 100%)",
    },
  },

  // ── Glass Backgrounds (5) ──────────────────────────────────────────
  {
    id: "glass-frost",
    name: "Arctic Frost",
    theme: "glass",
    light: {
      css: `
        radial-gradient(ellipse at 20% 50%, rgba(56,189,248,0.15), transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(14,165,233,0.1), transparent 40%),
        linear-gradient(135deg, #f0f4f8 0%, #e2ecf3 50%, #f0f4f8 100%)
      `,
      thumbnail: "linear-gradient(135deg, #f0f4f8 0%, #dce8f2 50%, #f0f4f8 100%)",
    },
    dark: {
      css: `
        radial-gradient(ellipse at 20% 50%, rgba(56,189,248,0.14), transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(14,165,233,0.08), transparent 40%),
        linear-gradient(135deg, #090f18 0%, #0d1726 50%, #060b12 100%)
      `,
      thumbnail: "linear-gradient(135deg, #0f1c2e 0%, #080e18 100%)",
    },
  },
  {
    id: "glass-aurora",
    name: "Aurora Borealis",
    theme: "glass",
    light: {
      css: `
        radial-gradient(ellipse at 10% 90%, rgba(56,189,248,0.18), transparent 50%),
        radial-gradient(ellipse at 90% 10%, rgba(168,85,247,0.12), transparent 50%),
        radial-gradient(ellipse at 50% 50%, rgba(14,165,233,0.06), transparent 60%),
        linear-gradient(160deg, #eef2f7 0%, #f0f4fa 50%, #edf0f8 100%)
      `,
      thumbnail: "linear-gradient(135deg, #eef2f7 0%, #e5eaf8 50%, #edf0f8 100%)",
    },
    dark: {
      css: `
        radial-gradient(ellipse at 10% 90%, rgba(56,189,248,0.16), transparent 50%),
        radial-gradient(ellipse at 90% 10%, rgba(168,85,247,0.14), transparent 50%),
        radial-gradient(ellipse at 50% 50%, rgba(14,165,233,0.06), transparent 60%),
        linear-gradient(160deg, #0a0d17 0%, #111322 50%, #080910 100%)
      `,
      thumbnail: "linear-gradient(135deg, #15182e 0%, #090b14 100%)",
    },
  },
  {
    id: "glass-ocean-depth",
    name: "Ocean Depth",
    theme: "glass",
    light: {
      css: `
        radial-gradient(ellipse at 30% 80%, rgba(2,132,199,0.12), transparent 50%),
        radial-gradient(ellipse at 70% 30%, rgba(14,165,233,0.09), transparent 40%),
        linear-gradient(180deg, #e8f0f6 0%, #dae6f0 50%, #e4eef6 100%)
      `,
      thumbnail: "linear-gradient(180deg, #e8f0f6 0%, #dae6f0 50%, #e4eef6 100%)",
    },
    dark: {
      css: `
        radial-gradient(ellipse at 30% 80%, rgba(2,132,199,0.16), transparent 50%),
        radial-gradient(ellipse at 70% 30%, rgba(14,165,233,0.1), transparent 40%),
        linear-gradient(180deg, #07131e 0%, #0b1a2b 50%, #050c14 100%)
      `,
      thumbnail: "linear-gradient(180deg, #0d2238 0%, #050d17 100%)",
    },
  },
  {
    id: "glass-nebula",
    name: "Nebula Mist",
    theme: "glass",
    light: {
      css: `
        radial-gradient(circle at 25% 25%, rgba(99,102,241,0.1), transparent 45%),
        radial-gradient(circle at 75% 75%, rgba(56,189,248,0.12), transparent 45%),
        radial-gradient(circle at 50% 50%, rgba(236,72,153,0.05), transparent 50%),
        linear-gradient(150deg, #f0f2fa 0%, #edf0f8 50%, #f2f0fa 100%)
      `,
      thumbnail: "linear-gradient(150deg, #f0f2fa 0%, #edf0f8 50%, #f2f0fa 100%)",
    },
    dark: {
      css: `
        radial-gradient(circle at 25% 25%, rgba(99,102,241,0.15), transparent 45%),
        radial-gradient(circle at 75% 75%, rgba(56,189,248,0.12), transparent 45%),
        radial-gradient(circle at 50% 50%, rgba(236,72,153,0.08), transparent 50%),
        linear-gradient(150deg, #0b0d1a 0%, #131227 50%, #070810 100%)
      `,
      thumbnail: "linear-gradient(150deg, #181734 0%, #080811 100%)",
    },
  },
  {
    id: "glass-emerald-prism",
    name: "Emerald Prism",
    theme: "glass",
    light: {
      css: `
        radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.12), transparent 45%),
        radial-gradient(ellipse at 20% 80%, rgba(6,182,212,0.1), transparent 50%),
        linear-gradient(140deg, #edf7f4 0%, #e2f0ec 50%, #edf7f4 100%)
      `,
      thumbnail: "linear-gradient(140deg, #edf7f4 0%, #d4eae4 50%, #edf7f4 100%)",
    },
    dark: {
      css: `
        radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.14), transparent 45%),
        radial-gradient(ellipse at 20% 80%, rgba(6,182,212,0.1), transparent 50%),
        linear-gradient(140deg, #071512 0%, #0d1e1a 50%, #050d0b 100%)
      `,
      thumbnail: "linear-gradient(140deg, #0f2b24 0%, #050f0c 100%)",
    },
  },

  // ── Cartoon Backgrounds (5) ────────────────────────────────────────
  {
    id: "cartoon-sunny",
    name: "Sunny Day",
    theme: "cartoon",
    light: {
      css: `
        radial-gradient(circle at 80% 15%, rgba(251,191,36,0.3), transparent 35%),
        radial-gradient(circle at 20% 80%, rgba(244,63,94,0.1), transparent 40%),
        linear-gradient(180deg, #fffbeb 0%, #fff7d6 40%, #fffbeb 100%)
      `,
      thumbnail: "linear-gradient(180deg, #fffbeb 0%, #fff3c4 50%, #fffbeb 100%)",
    },
    dark: {
      css: `
        radial-gradient(circle at 80% 15%, rgba(251,191,36,0.18), transparent 35%),
        radial-gradient(circle at 20% 80%, rgba(244,63,94,0.12), transparent 40%),
        linear-gradient(180deg, #1c1913 0%, #282114 40%, #14120e 100%)
      `,
      thumbnail: "linear-gradient(180deg, #2b2314 0%, #15130f 100%)",
    },
  },
  {
    id: "cartoon-candy",
    name: "Candy Pop",
    theme: "cartoon",
    light: {
      css: `
        radial-gradient(circle at 15% 20%, rgba(251,113,133,0.18), transparent 35%),
        radial-gradient(circle at 85% 70%, rgba(251,191,36,0.14), transparent 35%),
        radial-gradient(circle at 50% 50%, rgba(96,165,250,0.08), transparent 50%),
        linear-gradient(160deg, #fff5f7 0%, #fffbeb 50%, #f0f9ff 100%)
      `,
      thumbnail: "linear-gradient(160deg, #fff5f7 0%, #fffbeb 50%, #f0f9ff 100%)",
    },
    dark: {
      css: `
        radial-gradient(circle at 15% 20%, rgba(251,113,133,0.18), transparent 35%),
        radial-gradient(circle at 85% 70%, rgba(251,191,36,0.12), transparent 35%),
        radial-gradient(circle at 50% 50%, rgba(96,165,250,0.08), transparent 50%),
        linear-gradient(160deg, #1c1116 0%, #1c1912 50%, #0d171e 100%)
      `,
      thumbnail: "linear-gradient(160deg, #28141d 0%, #101923 100%)",
    },
  },
  {
    id: "cartoon-mint-fresh",
    name: "Mint Fresh",
    theme: "cartoon",
    light: {
      css: `
        radial-gradient(circle at 30% 70%, rgba(52,211,153,0.15), transparent 40%),
        radial-gradient(circle at 70% 20%, rgba(251,191,36,0.12), transparent 35%),
        linear-gradient(170deg, #ecfdf5 0%, #fffbeb 50%, #ecfdf5 100%)
      `,
      thumbnail: "linear-gradient(170deg, #ecfdf5 0%, #fffbeb 50%, #ecfdf5 100%)",
    },
    dark: {
      css: `
        radial-gradient(circle at 30% 70%, rgba(52,211,153,0.15), transparent 40%),
        radial-gradient(circle at 70% 20%, rgba(251,191,36,0.1), transparent 35%),
        linear-gradient(170deg, #0e1d17 0%, #191811 50%, #0a1712 100%)
      `,
      thumbnail: "linear-gradient(170deg, #122820 0%, #0b1812 100%)",
    },
  },
  {
    id: "cartoon-bubble",
    name: "Bubble Gum",
    theme: "cartoon",
    light: {
      css: `
        radial-gradient(circle at 20% 30%, rgba(244,63,94,0.14), transparent 35%),
        radial-gradient(circle at 80% 60%, rgba(168,85,247,0.1), transparent 35%),
        radial-gradient(circle at 50% 90%, rgba(251,191,36,0.12), transparent 30%),
        linear-gradient(165deg, #fdf2f8 0%, #fffbeb 40%, #faf5ff 100%)
      `,
      thumbnail: "linear-gradient(165deg, #fdf2f8 0%, #fffbeb 40%, #faf5ff 100%)",
    },
    dark: {
      css: `
        radial-gradient(circle at 20% 30%, rgba(244,63,94,0.15), transparent 35%),
        radial-gradient(circle at 80% 60%, rgba(168,85,247,0.12), transparent 35%),
        radial-gradient(circle at 50% 90%, rgba(251,191,36,0.1), transparent 30%),
        linear-gradient(165deg, #1b0e17 0%, #1a1711 40%, #15111b 100%)
      `,
      thumbnail: "linear-gradient(165deg, #281222 0%, #140e1b 100%)",
    },
  },
  {
    id: "cartoon-retro-grid",
    name: "Retro Comic Grid",
    theme: "cartoon",
    light: {
      css: `
        radial-gradient(circle at 85% 15%, rgba(245,158,11,0.2), transparent 40%),
        repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(24,24,27,0.03) 28px, rgba(24,24,27,0.03) 29px),
        repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(24,24,27,0.03) 28px, rgba(24,24,27,0.03) 29px),
        linear-gradient(#fffdf5, #fffdf5)
      `,
      thumbnail: "linear-gradient(135deg, #fffdf5 0%, #fef3c7 100%)",
    },
    dark: {
      css: `
        radial-gradient(circle at 85% 15%, rgba(245,158,11,0.12), transparent 40%),
        repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.03) 28px, rgba(255,255,255,0.03) 29px),
        repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(255,255,255,0.03) 28px, rgba(255,255,255,0.03) 29px),
        linear-gradient(#171613, #171613)
      `,
      thumbnail: "linear-gradient(135deg, #24211a 0%, #12110e 100%)",
    },
  },

  {
    id: "dreamy-cloud-sky",
    name: "Dreamy Cloud Sky",
    theme: "dreamy",
    light: {
      css: `
        radial-gradient(120% 60% at 20% -5%, rgba(255,255,255,0.85), transparent 55%),
        radial-gradient(80% 50% at 85% 110%, rgba(168,150,232,0.35), transparent 60%),
        radial-gradient(60% 40% at 50% 30%, rgba(255,255,255,0.9), transparent 70%),
        linear-gradient(175deg, #e8e4fb 0%, #f3f1fb 45%, #dbe7fb 100%)
      `,
      thumbnail: "linear-gradient(175deg, #e6e1fa 0%, #dbe7fb 100%)",
    },
    dark: {
      css: `
        radial-gradient(120% 60% at 20% -5%, rgba(120,110,200,0.12), transparent 55%),
        radial-gradient(80% 50% at 85% 110%, rgba(160,140,220,0.16), transparent 60%),
        radial-gradient(120% 120% at 50% 130%, rgba(60,50,120,0.35), transparent 70%),
        linear-gradient(175deg, #17142e 0%, #1c1834 50%, #0f0f22 100%)
      `,
      thumbnail: "linear-gradient(175deg, #1b1732 0%, #0f0f20 100%)",
    },
  },
  {
    id: "dreamy-pastel-cloud",
    name: "Pastel Cloud",
    theme: "dreamy",
    light: {
      css: `
        radial-gradient(circle at 25% 25%, rgba(255,214,236,0.6), transparent 45%),
        radial-gradient(circle at 75% 30%, rgba(203,218,255,0.6), transparent 45%),
        radial-gradient(circle at 50% 85%, rgba(255,214,236,0.4), transparent 50%),
        linear-gradient(180deg, #fdf6fd 0%, #eef2ff 60%, #e0e9ff 100%)
      `,
      thumbnail: "linear-gradient(180deg, #fdf2fd 0%, #e0e9ff 100%)",
    },
    dark: {
      css: `
        radial-gradient(circle at 25% 25%, rgba(120,90,170,0.2), transparent 45%),
        radial-gradient(circle at 75% 30%, rgba(80,110,180,0.2), transparent 45%),
        radial-gradient(circle at 50% 85%, rgba(120,90,170,0.18), transparent 50%),
        linear-gradient(180deg, #1a1730 0%, #15152b 60%, #101024 100%)
      `,
      thumbnail: "linear-gradient(180deg, #1d1934 0%, #101023 100%)",
    },
  },
  {
    id: "dreamy-lavender-mist",
    name: "Lavender Mist",
    theme: "dreamy",
    light: {
      css: `
        radial-gradient(100% 60% at 30% 0%, rgba(201,165,214,0.4), transparent 55%),
        radial-gradient(90% 60% at 80% 100%, rgba(143,134,217,0.35), transparent 55%),
        radial-gradient(70% 50% at 50% 55%, rgba(255,255,255,0.7), transparent 60%),
        linear-gradient(165deg, #f4eefb 0%, #eae4f9 50%, #e0d8f6 100%)
      `,
      thumbnail: "linear-gradient(165deg, #f4eefb 0%, #dfd5f5 100%)",
    },
    dark: {
      css: `
        radial-gradient(100% 60% at 30% 0%, rgba(201,165,214,0.16), transparent 55%),
        radial-gradient(90% 60% at 80% 100%, rgba(143,134,217,0.18), transparent 55%),
        radial-gradient(70% 50% at 50% 55%, rgba(0,0,0,0.25), transparent 60%),
        linear-gradient(165deg, #211c40 0%, #1a1734 50%, #161330 100%)
      `,
      thumbnail: "linear-gradient(165deg, #241e44 0%, #151228 100%)",
    },
  },
  {
    id: "dreamy-moonlight",
    name: "Moonlit Cloud",
    theme: "dreamy",
    light: {
      css: `
        radial-gradient(80% 70% at 75% 15%, rgba(255,240,214,0.7), transparent 55%),
        radial-gradient(90% 55% at 20% 80%, rgba(143,134,217,0.35), transparent 60%),
        linear-gradient(180deg, #fdf4e9 0%, #ece8fb 55%, #dce7fb 100%)
      `,
      thumbnail: "linear-gradient(180deg, #fef6ec 0%, #dbe7fb 100%)",
    },
    dark: {
      css: `
        radial-gradient(80% 70% at 75% 15%, rgba(230,215,180,0.12), transparent 55%),
        radial-gradient(90% 55% at 20% 80%, rgba(143,134,217,0.2), transparent 60%),
        radial-gradient(120% 90% at 50% 20%, rgba(255,255,255,0.05), transparent 60%),
        linear-gradient(180deg, #1a1832 0%, #14142c 55%, #0f1022 100%)
      `,
      thumbnail: "linear-gradient(180deg, #1e1b38 0%, #0e0f20 100%)",
    },
  },
  {
    id: "dreamy-starlight",
    name: "Starlight Dream",
    theme: "dreamy",
    light: {
      css: `
        radial-gradient(circle at 20% 20%, rgba(167,158,240,0.35), transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(201,165,214,0.3), transparent 45%),
        linear-gradient(175deg, #f2eefc 0%, #e7e2f8 60%, #dae6fb 100%)
      `,
      thumbnail: "linear-gradient(175deg, #f1edfc 0%, #d9e5fb 100%)",
    },
    dark: {
      css: `
        radial-gradient(circle at 20% 20%, rgba(167,158,240,0.16), transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(201,165,214,0.16), transparent 45%),
        radial-gradient(1px 1px at 30% 30%, rgba(255,255,255,0.6), transparent 40%),
        radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.5), transparent 40%),
        radial-gradient(1px 1px at 55% 15%, rgba(255,255,255,0.5), transparent 40%),
        linear-gradient(175deg, #1b1734 0%, #14122c 60%, #0e0e1e 100%)
      `,
      thumbnail: "linear-gradient(175deg, #1e1a38 0%, #0d0c1c 100%)",
    },
  },
  {
    id: "minimal-light-slate",
    name: "Minimal Slate",
    theme: "minimalistic",
    light: {
      css: `
        radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.9), transparent 55%),
        linear-gradient(180deg, #ffffff 0%, #f9fafb 55%, #f3f4f6 100%)
      `,
      thumbnail: "linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)",
    },
    dark: {
      css: `linear-gradient(180deg, #0b0b0d 0%, #121214 60%, #16161a 100%)`,
      thumbnail: "linear-gradient(180deg, #0b0b0d 0%, #17171b 100%)",
    },
  },
  {
    id: "minimal-line-grid",
    name: "Minimal Line Grid",
    theme: "minimalistic",
    light: {
      css: `
        repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(17,24,39,0.03) 40px, rgba(17,24,39,0.03) 41px),
        repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(17,24,39,0.03) 40px, rgba(17,24,39,0.03) 41px),
        linear-gradient(#ffffff, #ffffff)
      `,
      thumbnail: "linear-gradient(135deg, #ffffff 0%, #f1f1f1 100%)",
    },
    dark: {
      css: `
        repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px),
        repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px),
        linear-gradient(#0b0b0d, #0b0b0d)
      `,
      thumbnail: "linear-gradient(135deg, #0b0b0d 0%, #141416 100%)",
    },
  },
  {
    id: "minimal-concrete",
    name: "Minimal Concrete",
    theme: "minimalistic",
    light: {
      css: `
        radial-gradient(80% 50% at 30% 20%, rgba(17,24,39,0.04), transparent 60%),
        radial-gradient(80% 50% at 75% 85%, rgba(17,24,39,0.04), transparent 60%),
        linear-gradient(160deg, #fbfbfb 0%, #f3f4f6 100%)
      `,
      thumbnail: "linear-gradient(160deg, #fbfbfb 0%, #e8e8ea 100%)",
    },
    dark: {
      css: `
        radial-gradient(80% 50% at 30% 20%, rgba(255,255,255,0.04), transparent 60%),
        radial-gradient(80% 50% at 75% 85%, rgba(255,255,255,0.04), transparent 60%),
        linear-gradient(160deg, #0e0e10 0%, #161618 100%)
      `,
      thumbnail: "linear-gradient(160deg, #0e0e10 0%, #1a1a1d 100%)",
    },
  },
  {
    id: "minimal-arch-groove",
    name: "Minimal Groove",
    theme: "minimalistic",
    light: {
      css: `
        repeating-linear-gradient(0deg, transparent, transparent 32px, rgba(17,24,39,0.02) 32px, rgba(17,24,39,0.02) 33px),
        linear-gradient(#ffffff, #fafafa)
      `,
      thumbnail: "linear-gradient(180deg, #ffffff 0%, #efefef 100%)",
    },
    dark: {
      css: `
        repeating-linear-gradient(0deg, transparent, transparent 32px, rgba(255,255,255,0.02) 32px, rgba(255,255,255,0.02) 33px),
        linear-gradient(#0b0b0d, #121214)
      `,
      thumbnail: "linear-gradient(180deg, #0b0b0d 0%, #151517 100%)",
    },
  },
  {
    id: "minimal-charcoal",
    name: "Minimal Charcoal",
    theme: "minimalistic",
    light: {
      css: `
        radial-gradient(90% 60% at 50% 0%, rgba(17,24,39,0.05), transparent 55%),
        linear-gradient(180deg, #fdfdfd 0%, #f0f0f0 100%)
      `,
      thumbnail: "linear-gradient(180deg, #fdfdfd 0%, #e8e8e8 100%)",
    },
    dark: {
      css: `
        radial-gradient(90% 60% at 50% 0%, rgba(255,255,255,0.04), transparent 55%),
        linear-gradient(180deg, #0b0b0d 0%, #1a1a1e 100%)
      `,
      thumbnail: "linear-gradient(180deg, #0a0a0c 0%, #1e1e22 100%)",
    },
  },
];

/** Get background presets for a given theme */
export function getBackgroundsForTheme(theme: ThemePresetKey): BackgroundPreset[] {
  if (theme === "custom") return BACKGROUND_PRESETS;
  return BACKGROUND_PRESETS.filter((b) => b.theme === theme);
}

/** Find a background preset by id */
export function getBackgroundById(id: string): BackgroundPreset | undefined {
  return BACKGROUND_PRESETS.find((b) => b.id === id);
}

/** Resolve CSS for a background preset taking mode into account */
export function resolveBackgroundCss(bgId: string, mode: ModeKey): string {
  const bg = getBackgroundById(bgId) || BACKGROUND_PRESETS[0];
  return mode === "dark" ? bg.dark.css : bg.light.css;
}

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
    defaultBackground: "paper-classic",
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
    defaultBackground: "glass-frost",
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
    defaultBackground: "cartoon-sunny",
    borderRadius: "0.875rem",
    glassBlur: false,
    paperGrain: false,
    borderStyle: "bold-cartoon",
  },
  dreamy: {
    name: "Dreamy",
    presetKey: "dreamy",
    supportedModes: ["light", "dark"],
    defaultMode: "light",
    colorScheme: "dreamy",
    fontFamily: "quicksand",
    homeLayout: "nature",
    defaultBackground: "dreamy-cloud-sky",
    borderRadius: "1rem",
    glassBlur: true,
    paperGrain: false,
    borderStyle: "solid",
  },
  minimalistic: {
    name: "Minimalistic",
    presetKey: "minimalistic",
    supportedModes: ["light", "dark"],
    defaultMode: "light",
    colorScheme: "minimalistic",
    fontFamily: "plus-jakarta",
    homeLayout: "modern",
    defaultBackground: "minimal-light-slate",
    borderRadius: "0.375rem",
    glassBlur: false,
    paperGrain: false,
    borderStyle: "solid",
  },
  custom: {
    name: "Custom",
    presetKey: "custom",
    supportedModes: ["light", "dark"],
    defaultMode: "light",
    colorScheme: "custom",
    fontFamily: "fraunces",
    homeLayout: "classic",
    defaultBackground: "paper-classic",
    borderRadius: "0.375rem",
    glassBlur: true,
    paperGrain: false,
    borderStyle: "solid",
  },
};

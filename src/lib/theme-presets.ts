export type ThemePresetKey = "paper" | "glass" | "cartoon" | "custom";
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
        #f4eddd
      `,
      thumbnail: "linear-gradient(170deg, #f4eddd 0%, #e8dcc4 100%)",
    },
    dark: {
      css: `
        radial-gradient(120% 60% at 50% -5%, rgba(255,255,255,0.04), transparent 55%),
        radial-gradient(90% 45% at 50% 108%, rgba(0,0,0,0.5), transparent 60%),
        #1b1710
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
        #f0e7d2
      `,
      thumbnail: "linear-gradient(180deg, #f0e7d2 0%, #e5d9bf 50%, #f0e7d2 100%)",
    },
    dark: {
      css: `
        repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,0.03) 24px, rgba(255,255,255,0.03) 25px),
        radial-gradient(ellipse at 30% 20%, rgba(157,179,146,0.06), transparent 60%),
        #16130e
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
        #f5edd8
      `,
      thumbnail: "radial-gradient(ellipse at 50% 50%, #f5edd8 40%, #e2d5b8 100%)",
    },
    dark: {
      css: `
        radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%),
        radial-gradient(circle at 50% 0%, rgba(201,106,65,0.05), transparent 60%),
        #19150f
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
        #fffdf5
      `,
      thumbnail: "linear-gradient(135deg, #fffdf5 0%, #fef3c7 100%)",
    },
    dark: {
      css: `
        radial-gradient(circle at 85% 15%, rgba(245,158,11,0.12), transparent 40%),
        repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.03) 28px, rgba(255,255,255,0.03) 29px),
        repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(255,255,255,0.03) 28px, rgba(255,255,255,0.03) 29px),
        #171613
      `,
      thumbnail: "linear-gradient(135deg, #24211a 0%, #12110e 100%)",
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

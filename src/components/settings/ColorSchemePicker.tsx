import { useState } from "react";
import { usePreferences } from "@/hooks/use-preferences";
import { useTranslation } from "@/hooks/use-translation";
import { COLOR_SCHEMES, type ColorPaletteTokens } from "@/lib/theme-presets";
import { Check, ChevronDown, ChevronUp, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to calculate simple contrast luminance
function getLuminance(hex: string): number {
  if (!hex || !hex.startsWith("#")) return 0.5;
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  if (isNaN(r) || isNaN(g) || isNaN(b)) return 0.5;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hasContrastWarning(bgHex: string, textHex: string): boolean {
  if (!bgHex || !textHex || !bgHex.startsWith("#") || !textHex.startsWith("#")) return false;
  const lum1 = getLuminance(bgHex);
  const lum2 = getLuminance(textHex);
  const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  return ratio < 2.5; // Warning if contrast ratio is very low
}

export function ColorSchemePicker() {
  const { preferences, setColorScheme, setCustomColors } = usePreferences();
  const { t } = useTranslation();
  const [showCustom, setShowCustom] = useState(Boolean(preferences.customColors));
  const [activeGroup, setActiveGroup] = useState<"brand" | "surface" | "nav" | "advanced">("brand");

  const currentMode = preferences.mode;
  const activeScheme = COLOR_SCHEMES[preferences.colorScheme] || COLOR_SCHEMES.paper;
  const activePalette =
    currentMode === "dark" && activeScheme.dark ? activeScheme.dark : activeScheme.light;

  const customModeColors =
    currentMode === "dark"
      ? preferences.customColors?.dark || {}
      : preferences.customColors?.light || {};

  const handleColorChange = async (tokenKey: keyof ColorPaletteTokens, hex: string) => {
    const updated = {
      ...preferences.customColors,
      [currentMode]: {
        ...customModeColors,
        [tokenKey]: hex,
      },
    };
    await setCustomColors(updated);
  };

  const getEffectiveColor = (token: keyof ColorPaletteTokens): string => {
    return (customModeColors[token] as string) || (activePalette[token] as string) || "#000000";
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-medium tracking-tight">
          {t.settings.colorSchemeSection}
        </h3>
        <p className="text-[13px] text-muted-foreground">
          Pilih skema palet bawaan atau sesuaikan peran warna semantik (Primary, Surface, Nav, dll).
        </p>
      </div>

      {/* Preset Color Schemes */}
      <div className="grid gap-3 sm:grid-cols-3">
        {Object.values(COLOR_SCHEMES).map((scheme) => {
          const isSelected =
            preferences.colorScheme === scheme.id && !preferences.customColors;
          const p = currentMode === "dark" && scheme.dark ? scheme.dark : scheme.light;

          return (
            <button
              key={scheme.id}
              type="button"
              onClick={() => void setColorScheme(scheme.id)}
              className={cn(
                "glass glass-hover flex items-center justify-between p-3.5 text-left transition-all cursor-pointer rounded-md",
                isSelected
                  ? "ring-2 ring-primary border-primary bg-card"
                  : "border-border/80 hover:bg-card/70"
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1">
                  <span
                    className="size-4 rounded-full border border-border/80"
                    style={{ backgroundColor: p.background }}
                  />
                  <span
                    className="size-4 rounded-full border border-border/80"
                    style={{ backgroundColor: p.primary }}
                  />
                  <span
                    className="size-4 rounded-full border border-border/80"
                    style={{ backgroundColor: p.accent }}
                  />
                </div>
                <span className="font-display text-sm font-medium">
                  {scheme.name}
                </span>
              </div>
              {isSelected && <Check className="size-4 text-primary" />}
            </button>
          );
        })}
      </div>

      {/* Accordion Toggle for Fine-tuning Semantic Roles */}
      <div className="border border-border/80 rounded-md bg-card/40 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="flex w-full items-center justify-between p-4 text-left font-display text-sm font-medium cursor-pointer"
        >
          <span>
            {t.settings.customColors} ({currentMode === "dark" ? t.colors.darkMode : t.colors.lightMode})
          </span>
          {showCustom ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        {showCustom && (
          <div className="border-t border-border/60 p-4 space-y-4">
            <p className="font-mono text-[11px] text-muted-foreground">
              Menyesuaikan peran warna semantik di bawah ini otomatis menyinkronkan live preview dan mengaktifkan status Tema Kustom.
            </p>

            {/* Semantic Role Sub-Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-border/60 pb-2">
              {[
                { id: "brand", label: t.colors.brandGroup },
                { id: "surface", label: t.colors.surfaceGroup },
                { id: "nav", label: t.colors.navGroup },
                { id: "advanced", label: t.colors.advancedGroup },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveGroup(tab.id as any)}
                  className={cn(
                    "rounded px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer",
                    activeGroup === tab.id
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-card/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sub-Tab 1: Brand (Primary & Accent + On-Colors) */}
            {activeGroup === "brand" && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {/* Primary & onPrimary Pair */}
                <div className="rounded border border-border/70 p-3 bg-background/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-semibold">{t.colors.primary}</span>
                    {hasContrastWarning(getEffectiveColor("primary"), getEffectiveColor("primaryForeground")) && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                        <AlertCircle className="size-3" /> Kontras rendah
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="kicker block text-[9px] mb-1">{t.colors.primary}</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={getEffectiveColor("primary")}
                          onChange={(e) => void handleColorChange("primary", e.target.value)}
                          className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={getEffectiveColor("primary")}
                          onChange={(e) => void handleColorChange("primary", e.target.value)}
                          className="w-full rounded border border-border bg-background/80 p-1 font-mono text-xs text-foreground"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="kicker block text-[9px] mb-1">{t.colors.onPrimary}</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={getEffectiveColor("primaryForeground")}
                          onChange={(e) => void handleColorChange("primaryForeground", e.target.value)}
                          className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={getEffectiveColor("primaryForeground")}
                          onChange={(e) => void handleColorChange("primaryForeground", e.target.value)}
                          className="w-full rounded border border-border bg-background/80 p-1 font-mono text-xs text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accent & onAccent Pair */}
                <div className="rounded border border-border/70 p-3 bg-background/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-semibold">{t.colors.accent}</span>
                    {hasContrastWarning(getEffectiveColor("accent"), getEffectiveColor("accentForeground")) && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                        <AlertCircle className="size-3" /> Kontras rendah
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="kicker block text-[9px] mb-1">{t.colors.accent}</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={getEffectiveColor("accent")}
                          onChange={(e) => void handleColorChange("accent", e.target.value)}
                          className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={getEffectiveColor("accent")}
                          onChange={(e) => void handleColorChange("accent", e.target.value)}
                          className="w-full rounded border border-border bg-background/80 p-1 font-mono text-xs text-foreground"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="kicker block text-[9px] mb-1">{t.colors.onAccent}</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={getEffectiveColor("accentForeground")}
                          onChange={(e) => void handleColorChange("accentForeground", e.target.value)}
                          className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={getEffectiveColor("accentForeground")}
                          onChange={(e) => void handleColorChange("accentForeground", e.target.value)}
                          className="w-full rounded border border-border bg-background/80 p-1 font-mono text-xs text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Surface & Main Page Canvas */}
            {activeGroup === "surface" && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {/* Background & onBackground (foreground) */}
                <div className="rounded border border-border/70 p-3 bg-background/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-semibold">{t.colors.mainGroup}</span>
                    {hasContrastWarning(getEffectiveColor("background"), getEffectiveColor("foreground")) && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                        <AlertCircle className="size-3" /> Kontras rendah
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="kicker block text-[9px] mb-1">{t.colors.background}</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={getEffectiveColor("background")}
                          onChange={(e) => void handleColorChange("background", e.target.value)}
                          className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={getEffectiveColor("background")}
                          onChange={(e) => void handleColorChange("background", e.target.value)}
                          className="w-full rounded border border-border bg-background/80 p-1 font-mono text-xs text-foreground"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="kicker block text-[9px] mb-1">{t.colors.foreground}</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={getEffectiveColor("foreground")}
                          onChange={(e) => void handleColorChange("foreground", e.target.value)}
                          className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={getEffectiveColor("foreground")}
                          onChange={(e) => void handleColorChange("foreground", e.target.value)}
                          className="w-full rounded border border-border bg-background/80 p-1 font-mono text-xs text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Surface & onSurface */}
                <div className="rounded border border-border/70 p-3 bg-background/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-semibold">{t.colors.surfaceGroup}</span>
                    {hasContrastWarning(getEffectiveColor("card"), getEffectiveColor("cardForeground")) && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                        <AlertCircle className="size-3" /> Kontras rendah
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="kicker block text-[9px] mb-1">{t.colors.card}</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={getEffectiveColor("card")}
                          onChange={(e) => void handleColorChange("card", e.target.value)}
                          className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={getEffectiveColor("card")}
                          onChange={(e) => void handleColorChange("card", e.target.value)}
                          className="w-full rounded border border-border bg-background/80 p-1 font-mono text-xs text-foreground"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="kicker block text-[9px] mb-1">{t.colors.onSurface}</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={getEffectiveColor("cardForeground")}
                          onChange={(e) => void handleColorChange("cardForeground", e.target.value)}
                          className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={getEffectiveColor("cardForeground")}
                          onChange={(e) => void handleColorChange("cardForeground", e.target.value)}
                          className="w-full rounded border border-border bg-background/80 p-1 font-mono text-xs text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Navigation */}
            {activeGroup === "nav" && (
              <div className="rounded border border-border/70 p-3 bg-background/40 space-y-2.5 max-w-xl">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-semibold">{t.colors.navGroup}</span>
                  {hasContrastWarning(getEffectiveColor("nav"), getEffectiveColor("onNav")) && (
                    <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                      <AlertCircle className="size-3" /> Kontras rendah
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="kicker block text-[9px] mb-1">{t.colors.nav}</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={getEffectiveColor("nav")}
                        onChange={(e) => void handleColorChange("nav", e.target.value)}
                        className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={getEffectiveColor("nav")}
                        onChange={(e) => void handleColorChange("nav", e.target.value)}
                        className="w-full rounded border border-border bg-background/80 p-1 font-mono text-xs text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="kicker block text-[9px] mb-1">{t.colors.onNav}</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={getEffectiveColor("onNav")}
                        onChange={(e) => void handleColorChange("onNav", e.target.value)}
                        className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={getEffectiveColor("onNav")}
                        onChange={(e) => void handleColorChange("onNav", e.target.value)}
                        className="w-full rounded border border-border bg-background/80 p-1 font-mono text-xs text-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 4: Advanced (Tertiary, Border) */}
            {activeGroup === "advanced" && (
              <div className="grid gap-4 sm:grid-cols-2 max-w-xl">
                {/* Tertiary & onTertiary */}
                <div className="rounded border border-border/70 p-3 bg-background/40 space-y-2.5">
                  <span className="font-display text-xs font-semibold">{t.colors.tertiary}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="kicker block text-[9px] mb-1">{t.colors.tertiary}</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={getEffectiveColor("tertiary")}
                          onChange={(e) => void handleColorChange("tertiary", e.target.value)}
                          className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={getEffectiveColor("tertiary")}
                          onChange={(e) => void handleColorChange("tertiary", e.target.value)}
                          className="w-full rounded border border-border bg-background/80 p-1 font-mono text-xs text-foreground"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="kicker block text-[9px] mb-1">{t.colors.onTertiary}</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={getEffectiveColor("onTertiary")}
                          onChange={(e) => void handleColorChange("onTertiary", e.target.value)}
                          className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                        />
                        <input
                          type="text"
                          value={getEffectiveColor("onTertiary")}
                          onChange={(e) => void handleColorChange("onTertiary", e.target.value)}
                          className="w-full rounded border border-border bg-background/80 p-1 font-mono text-xs text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Border */}
                <div className="rounded border border-border/70 p-3 bg-background/40 space-y-2.5">
                  <span className="font-display text-xs font-semibold">{t.colors.border}</span>
                  <div>
                    <label className="kicker block text-[9px] mb-1">{t.colors.border}</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={getEffectiveColor("border")}
                        onChange={(e) => void handleColorChange("border", e.target.value)}
                        className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={getEffectiveColor("border")}
                        onChange={(e) => void handleColorChange("border", e.target.value)}
                        className="w-full rounded border border-border bg-background/80 p-1 font-mono text-xs text-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {preferences.customColors && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => void setCustomColors({})}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <RefreshCw className="size-3" />
                  Reset Warna Kustom
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

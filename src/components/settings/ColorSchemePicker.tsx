import { useState } from "react";
import { usePreferences } from "@/hooks/use-preferences";
import { useTranslation } from "@/hooks/use-translation";
import { COLOR_SCHEMES } from "@/lib/theme-presets";
import { Check, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function ColorSchemePicker() {
  const { preferences, setColorScheme, setCustomColors } = usePreferences();
  const { t } = useTranslation();
  const [showCustom, setShowCustom] = useState(Boolean(preferences.customColors));

  const currentMode = preferences.mode;
  const customModeColors =
    currentMode === "dark"
      ? preferences.customColors?.dark || {}
      : preferences.customColors?.light || {};

  const handleColorChange = async (tokenKey: string, hex: string) => {
    const updated = {
      ...preferences.customColors,
      [currentMode]: {
        ...customModeColors,
        [tokenKey]: hex,
      },
    };
    await setCustomColors(updated);
  };

  const activeScheme = COLOR_SCHEMES[preferences.colorScheme] || COLOR_SCHEMES.paper;
  const activePalette =
    currentMode === "dark" && activeScheme.dark ? activeScheme.dark : activeScheme.light;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-medium tracking-tight">
          {t.settings.colorSchemeSection}
        </h3>
        <p className="text-[13px] text-muted-foreground">
          Pilih skema palet bawaan atau sesuaikan warna sesukamu.
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
                "glass glass-hover flex items-center justify-between p-3.5 text-left transition-all cursor-pointer",
                isSelected
                  ? "ring-2 ring-primary border-primary bg-card"
                  : "border-border/80 hover:bg-card/70"
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1">
                  <span
                    className="size-4 rounded-full border border-border"
                    style={{ backgroundColor: p.background }}
                  />
                  <span
                    className="size-4 rounded-full border border-border"
                    style={{ backgroundColor: p.primary }}
                  />
                  <span
                    className="size-4 rounded-full border border-border"
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

      {/* Accordion Toggle for Fine-tuning Custom Colors */}
      <div className="border border-border/80 rounded bg-card/40">
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="flex w-full items-center justify-between p-4 text-left font-display text-sm font-medium cursor-pointer"
        >
          <span>{t.settings.customColors} ({currentMode === "dark" ? t.colors.darkMode : t.colors.lightMode})</span>
          {showCustom ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        {showCustom && (
          <div className="border-t border-border/60 p-4 space-y-4">
            <p className="font-mono text-[11px] text-muted-foreground">
              Menyesuaikan warna di bawah ini otomatis mengaktifkan status Tema Kustom.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Primary Color */}
              <div>
                <label className="kicker block text-[10px] mb-1.5">
                  {t.colors.primary}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customModeColors.primary || activePalette.primary}
                    onChange={(e) => void handleColorChange("primary", e.target.value)}
                    className="size-8 rounded cursor-pointer border border-border bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={customModeColors.primary || activePalette.primary}
                    onChange={(e) => void handleColorChange("primary", e.target.value)}
                    className="w-24 rounded border border-border bg-background/50 p-1 font-mono text-xs text-foreground"
                  />
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="kicker block text-[10px] mb-1.5">
                  {t.colors.accent}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customModeColors.accent || activePalette.accent}
                    onChange={(e) => void handleColorChange("accent", e.target.value)}
                    className="size-8 rounded cursor-pointer border border-border bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={customModeColors.accent || activePalette.accent}
                    onChange={(e) => void handleColorChange("accent", e.target.value)}
                    className="w-24 rounded border border-border bg-background/50 p-1 font-mono text-xs text-foreground"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div>
                <label className="kicker block text-[10px] mb-1.5">
                  {t.colors.background}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customModeColors.background || activePalette.background}
                    onChange={(e) => void handleColorChange("background", e.target.value)}
                    className="size-8 rounded cursor-pointer border border-border bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={customModeColors.background || activePalette.background}
                    onChange={(e) => void handleColorChange("background", e.target.value)}
                    className="w-24 rounded border border-border bg-background/50 p-1 font-mono text-xs text-foreground"
                  />
                </div>
              </div>
            </div>

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

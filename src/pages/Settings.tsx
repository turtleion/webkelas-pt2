import { useState } from "react";
import { usePreferences } from "@/hooks/use-preferences";
import { useTranslation } from "@/hooks/use-translation";
import { ThemeSelector } from "@/components/settings/ThemeSelector";
import { ColorSchemePicker } from "@/components/settings/ColorSchemePicker";
import { FontSelector } from "@/components/settings/FontSelector";
import { LayoutSelector } from "@/components/settings/LayoutSelector";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import { Sun, Moon, RotateCcw, Sliders, Globe, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Settings() {
  const { preferences, setMode, resetToDefaults } = usePreferences();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"personalization" | "language">("personalization");
  const [isResetting, setIsResetting] = useState(false);

  const isCartoonActive =
    preferences.theme === "cartoon" || preferences.colorScheme === "cartoon";

  const handleReset = async () => {
    if (window.confirm(t.settings.resetConfirm)) {
      setIsResetting(true);
      await resetToDefaults();
      setIsResetting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-6">
        <div>
          <span className="kicker">{t.nav.settings}</span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.settings.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.settings.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleReset()}
          disabled={isResetting}
          className="inline-flex items-center justify-center gap-2 self-start rounded border border-border/80 bg-card/60 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className={cn("size-3.5", isResetting && "animate-spin")} />
          <span>{t.settings.resetDefaults}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/60 pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("personalization")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 font-display text-sm font-medium border-b-2 transition-all cursor-pointer -mb-px",
            activeTab === "personalization"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Sliders className="size-4" />
          {t.settings.personalization}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("language")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 font-display text-sm font-medium border-b-2 transition-all cursor-pointer -mb-px",
            activeTab === "language"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Globe className="size-4" />
          {t.settings.language}
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "personalization" ? (
        <div className="space-y-10">
          {/* Mode Switcher */}
          <div className="space-y-3">
            <div>
              <h3 className="font-display text-xl font-medium tracking-tight">
                {t.settings.modeSection}
              </h3>
              <p className="text-[13px] text-muted-foreground">
                {t.settings.themeSelect}
              </p>
            </div>

            {isCartoonActive ? (
              <div className="flex items-center gap-2.5 rounded border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-200">
                <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>{t.settings.cartoonModeWarning}</span>
              </div>
            ) : (
              <div className="inline-flex rounded border border-border/80 bg-card/60 p-1">
                <button
                  type="button"
                  onClick={() => void setMode("light")}
                  className={cn(
                    "flex items-center gap-2 rounded px-4 py-2 text-xs font-medium transition-all cursor-pointer",
                    preferences.mode === "light"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Sun className="size-3.5" />
                  <span>{t.settings.lightMode}</span>
                </button>
                <button
                  type="button"
                  onClick={() => void setMode("dark")}
                  className={cn(
                    "flex items-center gap-2 rounded px-4 py-2 text-xs font-medium transition-all cursor-pointer",
                    preferences.mode === "dark"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Moon className="size-3.5" />
                  <span>{t.settings.darkMode}</span>
                </button>
              </div>
            )}
          </div>

          {/* Theme Presets */}
          <ThemeSelector />

          {/* Color Schemes */}
          <ColorSchemePicker />

          {/* Fonts */}
          <FontSelector />

          {/* Home Layout */}
          <LayoutSelector />
        </div>
      ) : (
        <div className="space-y-6">
          <LanguageSelector />
        </div>
      )}
    </div>
  );
}

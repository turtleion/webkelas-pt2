import { usePreferences } from "@/hooks/use-preferences";
import { BACKGROUND_PRESETS } from "@/lib/theme-presets";
import { useTranslation } from "@/hooks/use-translation";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackgroundSelector() {
  const { preferences, setBackground } = usePreferences();
  const { t } = useTranslation();

  const currentTheme = preferences.theme;
  const currentMode = preferences.mode;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-medium tracking-tight">
          {t.settings.backgroundSection}
        </h3>
        <p className="text-[13px] text-muted-foreground">
          {t.settings.backgroundSelect}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {BACKGROUND_PRESETS.map((bg) => {
          const isSelected = preferences.background === bg.id;
          const isThemeNative = bg.theme === currentTheme;
          const activeVariant = currentMode === "dark" ? bg.dark : bg.light;

          return (
            <button
              key={bg.id}
              type="button"
              onClick={() => void setBackground(bg.id)}
              className={cn(
                "glass glass-hover flex flex-col justify-between p-3 text-left transition-all cursor-pointer relative rounded-md overflow-hidden",
                isSelected
                  ? "ring-2 ring-primary border-primary bg-card"
                  : "border-border/80 hover:bg-card/70"
              )}
            >
              {/* Visual Preview Swatch */}
              <div
                className="w-full h-20 rounded border border-border/80 shadow-xs relative overflow-hidden mb-2.5"
                style={{ background: activeVariant.thumbnail }}
              >
                {isThemeNative && (
                  <span className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded bg-background/80 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-muted-foreground backdrop-blur-xs">
                    <Sparkles className="size-2 text-accent" />
                    {bg.theme}
                  </span>
                )}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-2.5" />
                  </div>
                )}
              </div>

              <div>
                <span className="font-display text-xs font-semibold block text-foreground truncate">
                  {bg.name}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  Tema {bg.theme}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

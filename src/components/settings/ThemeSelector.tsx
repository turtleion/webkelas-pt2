import { Check, Sparkles, BookOpen, Layers, Palette } from "lucide-react";
import { usePreferences, type ThemePresetKey } from "@/hooks/use-preferences";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

export function ThemeSelector() {
  const { preferences, setTheme } = usePreferences();
  const { t } = useTranslation();

  const themes: Array<{
    key: ThemePresetKey;
    title: string;
    description: string;
    icon: typeof BookOpen;
    previewColors: string[];
    badge?: string;
  }> = [
    {
      key: "paper",
      title: t.themes.paper,
      description: t.themes.paperDesc,
      icon: BookOpen,
      previewColors: ["#f4eddd", "#2e4631", "#a64f2b"],
      badge: "Default",
    },
    {
      key: "glass",
      title: t.themes.glass,
      description: t.themes.glassDesc,
      icon: Layers,
      previewColors: ["#f0f4f8", "#0284c7", "#0ea5e9"],
      badge: "Frosted",
    },
    {
      key: "cartoon",
      title: t.themes.cartoon,
      description: t.themes.cartoonDesc,
      icon: Sparkles,
      previewColors: ["#fffbeb", "#f59e0b", "#f43f5e"],
      badge: "Light Only",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-medium tracking-tight">
            {t.settings.themeSection}
          </h3>
          <p className="text-[13px] text-muted-foreground">
            {t.settings.themeSelect}
          </p>
        </div>
        {preferences.isCustom && (
          <span className="kicker rounded bg-accent/15 px-2.5 py-1 text-[9px] text-accent font-semibold flex items-center gap-1.5">
            <Palette className="size-3" /> {t.themes.custom}
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {themes.map((item) => {
          const isSelected = preferences.theme === item.key;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => void setTheme(item.key)}
              className={cn(
                "glass glass-hover flex flex-col justify-between p-5 text-left transition-all cursor-pointer relative",
                isSelected
                  ? "ring-2 ring-primary border-primary/60 bg-card"
                  : "border-border/80 hover:bg-card/70"
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded border border-border/80 bg-background/50 text-foreground">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-medium">
                      {item.title}
                    </h4>
                    {item.badge && (
                      <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>

              {/* Color Swatch Preview */}
              <div className="mt-4 flex items-center gap-1.5 border-t border-border/60 pt-3">
                <span className="font-mono text-[9px] uppercase text-muted-foreground mr-1">
                  Palet:
                </span>
                {item.previewColors.map((col, idx) => (
                  <span
                    key={idx}
                    className="size-4 rounded-full border border-border/80"
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

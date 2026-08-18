import { usePreferences, type HomeLayoutKey } from "@/hooks/use-preferences";
import { useTranslation } from "@/hooks/use-translation";
import { Check, Newspaper, LayoutGrid, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";

export function LayoutSelector() {
  const { preferences, setHomeLayout } = usePreferences();
  const { t } = useTranslation();

  const layouts: Array<{
    key: HomeLayoutKey;
    title: string;
    description: string;
    icon: typeof Newspaper;
  }> = [
    {
      key: "classic",
      title: t.layouts.classic,
      description: t.layouts.classicDesc,
      icon: Newspaper,
    },
    {
      key: "bento",
      title: t.layouts.bento,
      description: t.layouts.bentoDesc,
      icon: LayoutGrid,
    },
    {
      key: "showcase",
      title: t.layouts.showcase,
      description: t.layouts.showcaseDesc,
      icon: LayoutTemplate,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-medium tracking-tight">
          {t.settings.homeLayoutSection}
        </h3>
        <p className="text-[13px] text-muted-foreground">
          Pilih salah satu dari 3 varian susunan antarmuka Beranda.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {layouts.map((l) => {
          const isSelected = preferences.homeLayout === l.key;
          const Icon = l.icon;

          return (
            <button
              key={l.key}
              type="button"
              onClick={() => void setHomeLayout(l.key)}
              className={cn(
                "glass glass-hover flex flex-col justify-between p-5 text-left transition-all cursor-pointer",
                isSelected
                  ? "ring-2 ring-primary border-primary bg-card"
                  : "border-border/80 hover:bg-card/70"
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex size-8 items-center justify-center rounded border border-border/80 bg-background/50 text-foreground">
                    <Icon className="size-4" />
                  </div>
                  {isSelected && <Check className="size-4 text-primary" />}
                </div>

                <h4 className="mt-3 font-display text-base font-medium">
                  {l.title}
                </h4>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {l.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

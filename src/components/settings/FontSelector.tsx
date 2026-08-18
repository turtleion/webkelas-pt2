import { usePreferences } from "@/hooks/use-preferences";
import { useTranslation } from "@/hooks/use-translation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function FontSelector() {
  const { preferences, availableFonts, setFont } = usePreferences();
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-medium tracking-tight">
          {t.settings.fontSection}
        </h3>
        <p className="text-[13px] text-muted-foreground">
          {t.settings.fontSelect}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {availableFonts.map((f) => {
          const isSelected = preferences.font === f.id;

          return (
            <button
              key={f.id}
              type="button"
              onClick={() => void setFont(f.id)}
              className={cn(
                "glass glass-hover flex flex-col justify-between p-4 text-left transition-all cursor-pointer",
                isSelected
                  ? "ring-2 ring-primary border-primary bg-card"
                  : "border-border/80 hover:bg-card/70"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-[10px] uppercase text-muted-foreground">
                  {f.name}
                </span>
                {isSelected && <Check className="size-4 text-primary" />}
              </div>

              <div className="mt-3">
                <span
                  className="text-2xl font-medium text-foreground block"
                  style={{ fontFamily: f.fontDisplay }}
                >
                  Aa Bb Gg 123
                </span>
                <p
                  className="mt-1 text-xs text-muted-foreground truncate"
                  style={{ fontFamily: f.fontSans }}
                >
                  Ruang Arsip Digital X TKJ 1
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

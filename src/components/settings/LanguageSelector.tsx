import { useTranslation } from "@/hooks/use-translation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

export function LanguageSelector() {
  const { locale, setLocale, t } = useTranslation();

  const languages: Array<{
    code: Locale;
    name: string;
    nativeName: string;
    flag: string;
  }> = [
    {
      code: "id",
      name: "Indonesian",
      nativeName: "Bahasa Indonesia",
      flag: "🇮🇩",
    },
    {
      code: "en",
      name: "English",
      nativeName: "English (US)",
      flag: "🇬🇧",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-medium tracking-tight">
          {t.settings.languageSection}
        </h3>
        <p className="text-[13px] text-muted-foreground">
          {t.settings.selectLanguage}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 max-w-md">
        {languages.map((lang) => {
          const isSelected = locale === lang.code;

          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => void setLocale(lang.code)}
              className={cn(
                "glass glass-hover flex items-center justify-between p-4 text-left transition-all cursor-pointer",
                isSelected
                  ? "ring-2 ring-primary border-primary bg-card"
                  : "border-border/80 hover:bg-card/70"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label={lang.name}>
                  {lang.flag}
                </span>
                <div>
                  <h4 className="font-display text-base font-medium">
                    {lang.nativeName}
                  </h4>
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">
                    {lang.name}
                  </span>
                </div>
              </div>
              {isSelected && <Check className="size-4 text-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

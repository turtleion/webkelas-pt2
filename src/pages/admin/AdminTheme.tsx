import { useState } from "react";
import { usePreferences } from "@/hooks/use-preferences";
import { useTranslation } from "@/hooks/use-translation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { THEME_PRESETS, COLOR_SCHEMES, BUILTIN_FONTS, BACKGROUND_PRESETS } from "@/lib/theme-presets";
import { loadGoogleFont } from "@/lib/font-loader";
import {
  Palette,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Check,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ThemePresetKey, HomeLayoutKey } from "@/hooks/use-preferences";

export default function AdminTheme() {
  const { globalDefaults, availableFonts, updateGlobalDefaults, addCustomFont, removeCustomFont } =
    usePreferences();
  const { t } = useTranslation();

  // Admin form state initialized from current global defaults
  const [theme, setTheme] = useState<ThemePresetKey>(globalDefaults.defaultTheme);
  const [colorScheme, setColorScheme] = useState<string>(globalDefaults.defaultColorScheme);
  const [font, setFont] = useState<string>(globalDefaults.defaultFont);
  const [homeLayout, setHomeLayout] = useState<HomeLayoutKey>(globalDefaults.defaultHomeLayout);
  const [background, setBackground] = useState<string>(globalDefaults.defaultBackground);
  const [mode, setMode] = useState<"light" | "dark">(globalDefaults.defaultMode);
  const [isSaving, setIsSaving] = useState(false);

  // New Google Font input state
  const [newFontName, setNewFontName] = useState("");
  const [isAddingFont, setIsAddingFont] = useState(false);

  const isCartoonActive = theme === "cartoon" || colorScheme === "cartoon";

  // Handle saving global defaults to Supabase organization_settings
  const handleSaveDefaults = async () => {
    setIsSaving(true);
    try {
      await updateGlobalDefaults({
        defaultTheme: theme,
        defaultColorScheme: colorScheme,
        defaultFont: font,
        defaultHomeLayout: homeLayout,
        defaultBackground: background,
        defaultMode: isCartoonActive ? "light" : mode,
      });
      toast.success(t.settings.saveSuccess || "Pengaturan tema global berhasil disimpan.");
    } catch (err) {
      console.error("Failed to save global defaults:", err);
      toast.error("Gagal menyimpan pengaturan tema global.");
    } finally {
      setIsSaving(false);
    }
  };

  // Preview and add new Google Font
  const handleAddGoogleFont = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newFontName.trim();
    if (!cleanName) return;

    setIsAddingFont(true);

    try {
      // Test font load
      await loadGoogleFont(cleanName);

      const fontId = `google-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
      await addCustomFont({
        id: fontId,
        name: cleanName,
        fontDisplay: `"${cleanName}", sans-serif`,
        fontSans: `"${cleanName}", sans-serif`,
        fontMono: '"IBM Plex Mono", monospace',
        googleFont: cleanName.replace(/\s+/g, "+"),
        isBuiltIn: false,
      });

      setNewFontName("");
      toast.success(`Font "${cleanName}" berhasil ditambahkan ke pustaka font!`);
    } catch (err) {
      console.error("Failed to load Google Font:", err);
      toast.error(`Font "${cleanName}" tidak ditemukan di Google Fonts.`);
    } finally {
      setIsAddingFont(false);
    }
  };

  const handleRemoveFont = async (fontId: string, fontName: string) => {
    if (window.confirm(`Hapus font kustom "${fontName}"?`)) {
      await removeCustomFont(fontId);
      if (font === fontId) {
        setFont("fraunces");
      }
      toast.success(`Font "${fontName}" berhasil dihapus.`);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-6">
          <div>
            <span className="kicker">{t.nav.adminPanel}</span>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t.admin.themeManagement}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.admin.globalDefaultsDesc}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleSaveDefaults()}
            disabled={isSaving}
            className="btn-primary inline-flex items-center gap-2 text-xs py-2 px-4 cursor-pointer disabled:opacity-50"
          >
            <Save className="size-3.5" />
            <span>{isSaving ? t.common.loading : t.admin.saveDefaults}</span>
          </button>
        </div>

        {/* Banner Penjelasan */}
        <div className="rounded border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <Palette className="size-5 shrink-0 text-primary mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-semibold block text-foreground">
                {t.admin.globalDefaultsTitle}
              </span>
              <span className="text-muted-foreground">
                {t.admin.globalDefaultsDesc}
              </span>
            </div>
          </div>
        </div>

        {/* 1. Default Theme Preset */}
        <div className="space-y-3">
          <div>
            <h3 className="font-display text-lg font-medium">{t.admin.defaultTheme}</h3>
            <p className="text-xs text-muted-foreground">{t.settings.themeSelect}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(THEME_PRESETS).map(([key, p]) => {
              const presetKey = key as ThemePresetKey;
              const isSelected = theme === presetKey;
              return (
                <button
                  key={presetKey}
                  type="button"
                  onClick={() => {
                    setTheme(presetKey);
                    setColorScheme(p.colorScheme);
                    setFont(p.fontFamily);
                    setHomeLayout(p.homeLayout);
                    setBackground(p.defaultBackground);
                    if (presetKey === "cartoon") setMode("light");
                  }}
                  className={cn(
                    "glass glass-hover flex flex-col justify-between p-4 text-left transition-all cursor-pointer",
                    isSelected
                      ? "ring-2 ring-primary border-primary bg-card"
                      : "border-border/80 hover:bg-card/70"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-semibold">{p.name}</span>
                    {isSelected && <Check className="size-4 text-primary" />}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t.themes[presetKey as keyof typeof t.themes] || p.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Mode Default */}
        <div className="space-y-3">
          <div>
            <h3 className="font-display text-lg font-medium">{t.admin.defaultMode}</h3>
            <p className="text-xs text-muted-foreground">{t.settings.modeSection}</p>
          </div>

          {isCartoonActive ? (
            <div className="flex items-center gap-2.5 rounded border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200 max-w-md">
              <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>{t.settings.cartoonModeWarning}</span>
            </div>
          ) : (
            <div className="inline-flex rounded border border-border/80 bg-card/60 p-1">
              <button
                type="button"
                onClick={() => setMode("light")}
                className={cn(
                  "px-4 py-2 text-xs font-medium rounded cursor-pointer transition-all",
                  mode === "light"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.settings.lightMode}
              </button>
              <button
                type="button"
                onClick={() => setMode("dark")}
                className={cn(
                  "px-4 py-2 text-xs font-medium rounded cursor-pointer transition-all",
                  mode === "dark"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.settings.darkMode}
              </button>
            </div>
          )}
        </div>

        {/* 3. Background Default */}
        <div className="space-y-3">
          <div>
            <h3 className="font-display text-lg font-medium">{t.admin.defaultBackground}</h3>
            <p className="text-xs text-muted-foreground">{t.settings.backgroundSelect}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {BACKGROUND_PRESETS.map((bg) => {
              const isSelected = background === bg.id;
              const activeVariant = mode === "dark" ? bg.dark : bg.light;
              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setBackground(bg.id)}
                  className={cn(
                    "glass glass-hover flex flex-col justify-between p-3 text-left transition-all cursor-pointer rounded-md overflow-hidden",
                    isSelected
                      ? "ring-2 ring-primary border-primary bg-card"
                      : "border-border/80 hover:bg-card/70"
                  )}
                >
                  <div
                    className="w-full h-16 rounded border border-border/80 relative mb-2"
                    style={{ background: activeVariant.thumbnail }}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-2.5" />
                      </div>
                    )}
                  </div>
                  <span className="font-display text-xs font-semibold block text-foreground truncate">
                    {bg.name}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    Tema {bg.theme}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Color Scheme Default */}
        <div className="space-y-3">
          <div>
            <h3 className="font-display text-lg font-medium">{t.admin.defaultColorScheme}</h3>
            <p className="text-xs text-muted-foreground">{t.settings.colorSchemeSection}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.values(COLOR_SCHEMES).map((s) => {
              const isSelected = colorScheme === s.id;
              const palette = mode === "dark" && s.dark ? s.dark : s.light;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setColorScheme(s.id);
                    if (s.id === "cartoon") setMode("light");
                  }}
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
                        className="size-3.5 rounded-full border border-border"
                        style={{ backgroundColor: palette.background }}
                      />
                      <span
                        className="size-3.5 rounded-full border border-border"
                        style={{ backgroundColor: palette.primary }}
                      />
                      <span
                        className="size-3.5 rounded-full border border-border"
                        style={{ backgroundColor: palette.accent }}
                      />
                    </div>
                    <span className="font-display text-xs font-medium">{s.name}</span>
                  </div>
                  {isSelected && <Check className="size-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Home Layout Default */}
        <div className="space-y-3">
          <div>
            <h3 className="font-display text-lg font-medium">{t.admin.defaultLayout}</h3>
            <p className="text-xs text-muted-foreground">
              {t.settings.homeLayoutSection}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { id: "classic", name: t.layouts.classic, desc: t.layouts.classicDesc },
              { id: "bento", name: t.layouts.bento, desc: t.layouts.bentoDesc },
              { id: "showcase", name: t.layouts.showcase, desc: t.layouts.showcaseDesc },
            ].map((l) => {
              const isSelected = homeLayout === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setHomeLayout(l.id as HomeLayoutKey)}
                  className={cn(
                    "glass glass-hover flex flex-col justify-between p-4 text-left transition-all cursor-pointer",
                    isSelected
                      ? "ring-2 ring-primary border-primary bg-card"
                      : "border-border/80 hover:bg-card/70"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-semibold">{l.name}</span>
                    {isSelected && <Check className="size-4 text-primary" />}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{l.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Google Fonts & Typography Library */}
        <div className="space-y-4 border-t border-border/80 pt-8">
          <div>
            <h3 className="font-display text-xl font-medium tracking-tight">
              {t.admin.fontsManagement}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t.settings.fontSelect}
            </p>
          </div>

          {/* Form Add Google Font */}
          <form
            onSubmit={(e) => void handleAddGoogleFont(e)}
            className="rounded border border-border/80 bg-card/60 p-4 space-y-3"
          >
            <label className="kicker block text-[10px]">{t.admin.addFont}</label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={newFontName}
                onChange={(e) => setNewFontName(e.target.value)}
                placeholder="Contoh: Inter, Poppins, Outfit, Plus Jakarta Sans..."
                className="rounded border border-border bg-background/50 px-3 py-2 text-xs flex-1 text-foreground"
              />
              <button
                type="submit"
                disabled={isAddingFont || !newFontName.trim()}
                className="btn-primary inline-flex items-center justify-center gap-1.5 text-xs py-2 px-4 cursor-pointer disabled:opacity-50"
              >
                <Plus className="size-3.5" />
                <span>{isAddingFont ? t.common.loading : t.admin.addFont}</span>
              </button>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
              <Sparkles className="size-3 text-accent" /> Masukkan nama persis sesuai di{" "}
              <a
                href="https://fonts.google.com"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-foreground inline-flex items-center gap-0.5"
              >
                Google Fonts <ExternalLink className="size-2.5" />
              </a>
            </p>
          </form>

          {/* Available Fonts Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {availableFonts.map((f) => {
              const isSelected = font === f.id;
              const isBuiltin = Boolean(f.isBuiltIn || BUILTIN_FONTS.some((bf) => bf.id === f.id));

              return (
                <div
                  key={f.id}
                  className={cn(
                    "glass flex flex-col justify-between p-4 transition-all relative",
                    isSelected ? "ring-2 ring-primary border-primary bg-card" : "border-border/80"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase text-muted-foreground">
                        {f.name}
                      </span>
                      {f.googleFont && (
                        <span className="rounded bg-primary/15 px-1.5 py-0.2 font-mono text-[8px] uppercase text-primary">
                          Google Font
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setFont(f.id)}
                        className={cn(
                          "rounded px-2 py-0.5 font-mono text-[10px] uppercase cursor-pointer transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "bg-background/80 hover:bg-background text-muted-foreground"
                        )}
                      >
                        {isSelected ? "Dipilih" : "Pilih"}
                      </button>

                      {!isBuiltin && (
                        <button
                          type="button"
                          onClick={() => void handleRemoveFont(f.id, f.name)}
                          className="rounded p-1 text-destructive/70 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                          title={t.admin.removeFont}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <span
                      className="text-2xl font-medium text-foreground block truncate"
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

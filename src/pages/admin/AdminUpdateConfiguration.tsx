import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { usePageTitle } from "@/hooks/use-page-title";
import { useTranslation } from "@/hooks/use-translation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  PackagePlus,
  Loader2,
  RefreshCw,
  Rocket,
  PencilRuler,
} from "lucide-react";

interface AppUpdateRow {
  id: number;
  version_code: number;
  version_name: string;
  apk_url: string;
  notes: string | null;
  is_forced: boolean;
  is_active: boolean;
  created_at: string;
}

const EMPTY_FORM = {
  version_code: "",
  version_name: "",
  apk_url: "",
  notes: "",
  is_forced: false,
  is_active: true,
};

export default function AdminUpdateConfiguration() {
  const { t } = useTranslation();
  usePageTitle("Update Configuration");

  const [updates, setUpdates] = useState<AppUpdateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("app_updates")
      .select("*")
      .order("version_code", { ascending: false });
    if (error) toast.error(error.message);
    else setUpdates(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (key: keyof typeof EMPTY_FORM, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleCreate = async () => {
    const versionCode = parseInt(form.version_code, 10);
    if (!versionCode || Number.isNaN(versionCode)) {
      toast.error("Version code harus angka");
      return;
    }
    if (!form.version_name.trim() || !form.apk_url.trim()) {
      toast.error("Version name dan APK URL wajib diisi");
      return;
    }

    setSaving(true);
    const payload = {
      version_code: versionCode,
      version_name: form.version_name.trim(),
      apk_url: form.apk_url.trim(),
      notes: form.notes.trim() || null,
      is_forced: form.is_forced,
      is_active: form.is_active,
    };

    const { error } = await supabase.from("app_updates").insert(payload);
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Update dibuat");
    setForm({ ...EMPTY_FORM });
    await load();
  };

  const toggleActive = async (row: AppUpdateRow) => {
    const { error } = await supabase
      .from("app_updates")
      .update({ is_active: !row.is_active })
      .eq("id", row.id);
    if (error) toast.error(error.message);
    else await load();
  };

  const remove = async (row: AppUpdateRow) => {
    if (!confirm(`Hapus update ${row.version_name}?`)) return;
    const { error } = await supabase
      .from("app_updates")
      .delete()
      .eq("id", row.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Update dihapus");
      await load();
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        nomor="UPD"
        label="Update"
        title="Update Configuration"
        description="Atur rilis APK untuk in-app updater. Versi aktif dengan version_code tertinggi yang dipakai app."
      />

      <div className="mt-10 grid max-w-4xl gap-8">
        {/* Create form */}
        <section className="rounded-xl border border-border/60 bg-card/60 p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-medium">
            <PackagePlus className="size-4 text-accent" /> Buat Update Baru
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="uc-vercode" className="kicker text-[10px]">
                Version Code
              </Label>
              <Input
                id="uc-vercode"
                type="number"
                value={form.version_code}
                onChange={(e) => set("version_code", e.target.value)}
                placeholder="3"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="uc-vername" className="kicker text-[10px]">
                Version Name
              </Label>
              <Input
                id="uc-vername"
                value={form.version_name}
                onChange={(e) => set("version_name", e.target.value)}
                placeholder="1.1.0"
                className="mt-2"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="uc-apkurl" className="kicker text-[10px]">
              APK URL
            </Label>
            <Input
              id="uc-apkurl"
              value={form.apk_url}
              onChange={(e) => set("apk_url", e.target.value)}
              placeholder="https://github.com/.../releases/download/BETA/...apk"
              className="mt-2"
            />
          </div>

          <div className="mt-4">
            <Label htmlFor="uc-notes" className="kicker text-[10px]">
              {t.update.notes}
            </Label>
            <Textarea
              id="uc-notes"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={2}
              placeholder="Fix notifikasi + updater"
              className="mt-2"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                id="uc-active"
                checked={form.is_active}
                onCheckedChange={(c) => set("is_active", Boolean(c))}
              />
              Aktif (langsung dipakai app)
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                id="uc-forced"
                checked={form.is_forced}
                onCheckedChange={(c) => set("is_forced", Boolean(c))}
              />
              {t.update.forced}
            </label>
          </div>

          <Button
            onClick={() => void handleCreate()}
            disabled={saving}
            className="mt-5 gap-2"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Rocket className="size-4" />
            )}
            {saving ? "Menyimpan..." : "Simpan Update"}
          </Button>
        </section>

        {/* List */}
        <section className="rounded-xl border border-border/60 bg-card/60 p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-base font-medium">
              <PencilRuler className="size-4 text-accent" /> Daftar Update
            </h2>
            <Button variant="ghost" size="sm" onClick={() => void load()}>
              <RefreshCw className="size-3.5" /> Refresh
            </Button>
          </div>

          {loading ? (
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              Memuat...
            </p>
          ) : updates.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Belum ada update. Buat yang pertama di atas.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border/60">
              {updates.map((u) => (
                <li
                  key={u.id}
                  className="flex flex-wrap items-center gap-3 py-3"
                >
                  <span className="font-mono text-sm font-semibold">
                    v{u.version_name}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    code {u.version_code}
                  </span>
                  {u.is_forced && (
                    <span className="rounded bg-destructive/15 px-1.5 py-0.5 font-mono text-[10px] uppercase text-destructive">
                      forced
                    </span>
                  )}
                  <span
                    className={
                      u.is_active
                        ? "rounded bg-green-500/15 px-1.5 py-0.5 font-mono text-[10px] uppercase text-green-600"
                        : "rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground"
                    }
                  >
                    {u.is_active ? "aktif" : "draft"}
                  </span>
                  <span className="ml-auto flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void toggleActive(u)}
                    >
                      {u.is_active ? "Nonaktifkan" : "Aktifkan"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => void remove(u)}
                    >
                      Hapus
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
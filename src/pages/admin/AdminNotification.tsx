import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePageTitle } from "@/hooks/use-page-title";
import { useTranslation } from "@/hooks/use-translation";
import { upsertDailyOverview, useDailyOverview } from "@/hooks/use-daily";
import { labelTanggal, nextSchoolDay, todayWIB } from "@/lib/daily";
import { Loader2, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import type { TranslationSchema } from "@/lib/i18n";

interface FormProps {
  date: string;
  t: TranslationSchema;
  isIntervened: boolean;
  hasRow: boolean;
  initialPakaian: string;
  initialBawaan: string;
  initialCatatan: string;
  onSaved: () => Promise<void>;
}

/**
 * Form data harian. Di-remount lewat `key` saat tanggal/versi baris berubah,
 * jadi nilai awal diambil dari props tanpa perlu state-sync di useEffect.
 */
function DailyForm({
  date,
  t,
  isIntervened,
  hasRow,
  initialPakaian,
  initialBawaan,
  initialCatatan,
  onSaved,
}: FormProps) {
  const [pakaian, setPakaian] = useState(initialPakaian);
  const [bawaan, setBawaan] = useState(initialBawaan);
  const [catatan, setCatatan] = useState(initialCatatan);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (intervened: boolean) => {
    setIsSaving(true);
    try {
      await upsertDailyOverview({
        target_date: date,
        pakaian,
        bawaan,
        catatan,
        is_intervened: intervened,
      });
      toast.success(
        intervened ? t.admin.interventionSaved : t.admin.interventionCleared,
      );
      await onSaved();
    } catch (err) {
      console.error("[AdminNotification] gagal menyimpan:", err);
      toast.error(t.admin.interventionSaveError);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-10 grid max-w-3xl gap-6">
      <div>
        <Label htmlFor="pakaian" className="kicker text-[10px]">
          {t.admin.clothingLabel}
        </Label>
        <Input
          id="pakaian"
          value={pakaian}
          onChange={(e) => setPakaian(e.target.value)}
          placeholder="Seragam putih abu-abu"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="bawaan" className="kicker text-[10px]">
          {t.admin.belongingsLabel}
        </Label>
        <Textarea
          id="bawaan"
          value={bawaan}
          onChange={(e) => setBawaan(e.target.value)}
          rows={4}
          placeholder={"Buku Bahasa Inggris\nLaptop\nModul jaringan"}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="catatan" className="kicker text-[10px]">
          {t.admin.noteLabel}
        </Label>
        <Textarea
          id="catatan"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          rows={3}
          placeholder="Besok ada kegiatan tambahan setelah pelajaran terakhir."
          className="mt-2"
        />
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border/60 pt-6">
        <Button
          type="button"
          disabled={isSaving}
          onClick={() => void handleSave(true)}
        >
          {isSaving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {t.admin.interventionSave}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSaving || !hasRow || !isIntervened}
          onClick={() => void handleSave(false)}
        >
          {t.admin.interventionClear}
        </Button>
      </div>

      <p className="text-[12px] leading-relaxed text-muted-foreground">
        {t.admin.notificationDesc}
      </p>
    </div>
  );
}

/**
 * Pusat kendali "Pemberitahuan Hari Esok".
 *
 * Default tanggal = hari sekolah berikutnya. Menyimpan di sini berarti
 * INTERVENSI: data manual jadi otoritatif dan generator otomatis (pg_cron)
 * tidak akan menimpanya selama is_intervened = true.
 */
export default function AdminNotification() {
  const { t } = useTranslation();
  usePageTitle(`${t.admin.notification} — Panel`);

  const [date, setDate] = useState<string>(() => nextSchoolDay() ?? todayWIB());
  const {
    targetDate,
    day,
    overview,
    pelajaran,
    piket,
    mbg,
    tugas,
    isLoading,
    refresh,
  } = useDailyOverview(date);

  return (
    <AdminLayout>
      <PageHeader
        nomor="09"
        label={t.nav.daily}
        title={t.admin.notificationHeading}
        description={t.admin.notificationDesc}
      />

      {/* Tanggal sasaran + status */}
      <div className="mt-8 flex flex-wrap items-end gap-4">
        <div className="w-full max-w-xs">
          <Label htmlFor="target-date" className="kicker text-[10px]">
            {t.admin.targetDateLabel}
          </Label>
          <Input
            id="target-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pb-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {labelTanggal(targetDate)}
          </span>
          <span
            className={`rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
              overview?.is_intervened
                ? "bg-accent/20 text-accent font-semibold"
                : "bg-primary/15 text-primary"
            }`}
          >
            {overview?.is_intervened
              ? t.admin.interventionData
              : t.admin.automaticData}
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mb-2 ml-auto"
          onClick={() => setDate(nextSchoolDay() ?? todayWIB())}
        >
          <RefreshCw className="size-3.5" />
          {t.nav.dailyOverview}
        </Button>
      </div>

      {/* Konteks: isi jadwal/tugas yang akan tampil di /daily */}
      <div className="mt-6 grid gap-px border border-border/60 bg-border/60 text-[12.5px] sm:grid-cols-4">
        {[
          { label: t.daily.scheduleSection, value: pelajaran.length },
          { label: t.daily.dutySection, value: piket.length },
          { label: t.daily.mbgSection, value: mbg.length },
          { label: t.daily.tasksSection, value: tugas.length },
        ].map((item) => (
          <div key={item.label} className="bg-background px-4 py-3">
            <p className="kicker text-[9px] text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-1 font-display text-lg">{item.value}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-10 flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <DailyForm
            key={`${date}:${overview?.updated_at ?? "empty"}`}
            date={date}
            t={t}
            isIntervened={Boolean(overview?.is_intervened)}
            hasRow={Boolean(overview)}
            initialPakaian={overview?.pakaian ?? ""}
            initialBawaan={overview?.bawaan ?? ""}
            initialCatatan={overview?.catatan ?? ""}
            onSaved={refresh}
          />

          {day && (
            <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {day} · {date}
            </p>
          )}
        </>
      )}
    </AdminLayout>
  );
}

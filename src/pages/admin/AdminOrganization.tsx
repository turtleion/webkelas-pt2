import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { usePageTitle } from "@/hooks/use-page-title";
import { useOrganization, type OrganizationData } from "@/hooks/use-organization";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminOrganization() {
  const { t } = useTranslation();
  usePageTitle(`${t.admin.organization} — Panel`);
  const { data, isLoading, save } = useOrganization();

  const [formData, setFormData] = useState<OrganizationData>(data);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleKelasChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      kelas: {
        ...prev.kelas,
        [field]: value,
      },
    }));
  };

  const handleWaliChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      kelas: {
        ...prev.kelas,
        waliKelas: {
          ...prev.kelas.waliKelas,
          [field]: value,
        },
      },
    }));
  };

  const handleKontakChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      kelas: {
        ...prev.kelas,
        kontak: {
          ...prev.kelas.kontak,
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await save(formData);
      toast.success(t.admin.toastOrgUpdated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.admin.toastOrgSaveError);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader
        nomor="06"
        label={t.admin.manageModules}
        title={t.admin.organization}
        description={t.admin.organizationDesc}
      />

      <form onSubmit={handleSubmit} className="mt-8 space-y-8 max-w-3xl">
        {/* Identitas Dasar */}
        <section className="glass p-6">
          <h2 className="font-display text-xl font-medium tracking-tight">
            {t.admin.orgSectionIdentity}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="kicker block text-[10px]">{t.admin.orgLabelClassName}</label>
              <Input
                value={formData.kelas.nama}
                onChange={(e) => handleKelasChange("nama", e.target.value)}
                className="mt-1 bg-background/50"
                required
              />
            </div>
            <div>
              <label className="kicker block text-[10px]">{t.admin.orgLabelSchoolName}</label>
              <Input
                value={formData.kelas.sekolah}
                onChange={(e) => handleKelasChange("sekolah", e.target.value)}
                className="mt-1 bg-background/50"
                required
              />
            </div>
            <div>
              <label className="kicker block text-[10px]">{t.admin.orgLabelMajorFull}</label>
              <Input
                value={formData.kelas.jurusan}
                onChange={(e) => handleKelasChange("jurusan", e.target.value)}
                className="mt-1 bg-background/50"
                required
              />
            </div>
            <div>
              <label className="kicker block text-[10px]">{t.admin.orgLabelMajorAbbr}</label>
              <Input
                value={formData.kelas.jurusanSingkat}
                onChange={(e) => handleKelasChange("jurusanSingkat", e.target.value)}
                className="mt-1 bg-background/50"
                required
              />
            </div>
            <div>
              <label className="kicker block text-[10px]">{t.admin.orgLabelAcademicYear}</label>
              <Input
                value={formData.kelas.tahunAjaran}
                onChange={(e) => handleKelasChange("tahunAjaran", e.target.value)}
                className="mt-1 bg-background/50"
                required
              />
            </div>
            <div>
              <label className="kicker block text-[10px]">{t.admin.orgLabelSemester}</label>
              <Input
                value={formData.kelas.semester}
                onChange={(e) => handleKelasChange("semester", e.target.value)}
                className="mt-1 bg-background/50"
                required
              />
            </div>
            <div>
              <label className="kicker block text-[10px]">{t.admin.orgLabelRoom}</label>
              <Input
                value={formData.kelas.ruang}
                onChange={(e) => handleKelasChange("ruang", e.target.value)}
                className="mt-1 bg-background/50"
                required
              />
            </div>
            <div>
              <label className="kicker block text-[10px]">{t.admin.orgLabelStudentCount}</label>
              <Input
                type="number"
                value={formData.kelas.jumlahSiswa}
                onChange={(e) => handleKelasChange("jumlahSiswa", Number(e.target.value))}
                className="mt-1 bg-background/50"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="kicker block text-[10px]">{t.admin.orgLabelAddress}</label>
            <Textarea
              value={formData.kelas.alamatSekolah}
              onChange={(e) => handleKelasChange("alamatSekolah", e.target.value)}
              className="mt-1 bg-background/50 h-16 text-sm"
              required
            />
          </div>
        </section>

        {/* Wali Kelas */}
        <section className="glass p-6">
          <h2 className="font-display text-xl font-medium tracking-tight">
            {t.admin.orgSectionHomeroom}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="kicker block text-[10px]">{t.admin.orgLabelHomeroomName}</label>
              <Input
                value={formData.kelas.waliKelas.nama}
                onChange={(e) => handleWaliChange("nama", e.target.value)}
                className="mt-1 bg-background/50 font-display text-base"
                required
              />
            </div>
            <div>
              <label className="kicker block text-[10px]">{t.admin.orgLabelDegree}</label>
              <Input
                value={formData.kelas.waliKelas.gelar}
                onChange={(e) => handleWaliChange("gelar", e.target.value)}
                placeholder={t.admin.organizationPlaceholderGelar}
                className="mt-1 bg-background/50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="kicker block text-[10px]">{t.admin.orgLabelRoleDesc}</label>
              <Input
                value={formData.kelas.waliKelas.peran}
                onChange={(e) => handleWaliChange("peran", e.target.value)}
                className="mt-1 bg-background/50 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Kontak & Media Sosial */}
        <section className="glass p-6">
          <h2 className="font-display text-xl font-medium tracking-tight">
            {t.admin.orgSectionContact}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="kicker block text-[10px]">{t.admin.orgLabelInstagramUser}</label>
              <Input
                value={formData.kelas.kontak.instagram}
                onChange={(e) => handleKontakChange("instagram", e.target.value)}
                placeholder={t.admin.organizationPlaceholderInstagram}
                className="mt-1 bg-background/50"
              />
            </div>
            <div>
              <label className="kicker block text-[10px]">{t.admin.orgLabelInstagramLink}</label>
              <Input
                value={formData.kelas.kontak.instagramUrl}
                onChange={(e) => handleKontakChange("instagramUrl", e.target.value)}
                placeholder={t.admin.organizationPlaceholderUrl}
                className="mt-1 bg-background/50"
              />
            </div>
            <div>
              <label className="kicker block text-[10px]">{t.admin.orgLabelEmail}</label>
              <Input
                type="email"
                value={formData.kelas.kontak.email}
                onChange={(e) => handleKontakChange("email", e.target.value)}
                className="mt-1 bg-background/50"
              />
            </div>
            <div>
              <label className="kicker block text-[10px]">{t.admin.orgLabelWhatsApp}</label>
              <Input
                value={formData.kelas.kontak.whatsapp}
                onChange={(e) => handleKontakChange("whatsapp", e.target.value)}
                placeholder={t.admin.organizationPlaceholderPhone}
                className="mt-1 bg-background/50"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer gap-2 bg-primary px-6 text-primary-foreground font-mono text-[11px] uppercase tracking-wider"
          >
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {t.common.save}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}

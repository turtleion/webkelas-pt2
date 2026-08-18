import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { usePageTitle } from "@/hooks/use-page-title";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useAgenda } from "@/hooks/use-agenda";
import { useSchedule } from "@/hooks/use-schedule";
import { useMembers } from "@/hooks/use-members";
import { useGallery } from "@/hooks/use-gallery";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router";
import {
  Megaphone,
  CalendarDays,
  CalendarCheck2,
  Users,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboard() {
  usePageTitle("Ringkasan Panel");
  const { user } = useAuth();

  const { data: pengumuman } = useAnnouncements(false);
  const { data: agenda } = useAgenda();
  const { data: jadwal } = useSchedule();
  const { data: anggota } = useMembers();
  const { data: galeri } = useGallery();

  const stats = [
    {
      title: "Pengumuman",
      count: pengumuman.length,
      desc: `${pengumuman.filter((p) => p.published).length} terbit`,
      link: "/admin/pengumuman",
      icon: Megaphone,
    },
    {
      title: "Agenda Kelas",
      count: agenda.length,
      desc: "kegiatan tercatat",
      link: "/admin/agenda",
      icon: CalendarDays,
    },
    {
      title: "Jadwal Pelajaran",
      count: jadwal.length,
      desc: "jam pelajaran",
      link: "/admin/jadwal",
      icon: CalendarCheck2,
    },
    {
      title: "Anggota Kelas",
      count: anggota.length,
      desc: "siswa terdaftar",
      link: "/admin/anggota",
      icon: Users,
    },
    {
      title: "Galeri Dokumentasi",
      count: galeri.length,
      desc: "foto tersimpan",
      link: "/admin/galeri",
      icon: ImageIcon,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        nomor="ADM"
        label="Ringkasan"
        title="Pusat Kendali Arsip"
        description={`Selamat datang di panel pengurus, ${user?.name || "Rekan"}. Kelola pengumuman, agenda, jadwal pelajaran, data anggota, dan dokumentasi kelas langsung tersinkron ke Supabase.`}
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              to={item.link}
              className="glass glass-hover group flex flex-col justify-between p-6 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="kicker text-[9px]">{item.title}</span>
                  <div className="flex size-8 items-center justify-center rounded bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="size-4" />
                  </div>
                </div>
                <p className="mt-4 font-display text-4xl font-semibold tracking-tight">
                  {item.count}
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1 border-t border-border/60 pt-3 font-mono text-[10px] uppercase tracking-wider text-accent group-hover:underline">
                <span>Kelola modul</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </AdminLayout>
  );
}

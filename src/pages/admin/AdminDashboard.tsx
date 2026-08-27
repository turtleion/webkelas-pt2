import { AdminLayout } from "@/components/admin/AdminLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { usePageTitle } from "@/hooks/use-page-title";
import { useArticles } from "@/hooks/use-articles";
import { useAgenda } from "@/hooks/use-agenda";
import { useSchedule } from "@/hooks/use-schedule";
import { useMembers } from "@/hooks/use-members";
import { useGallery } from "@/hooks/use-gallery";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { Link } from "react-router";
import {
  FileText,
  CalendarDays,
  CalendarCheck2,
  Users,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboard() {
  const { t, interpolate } = useTranslation();
  usePageTitle(t.admin.overview);
  const { user } = useAuth();

  const { data: articles } = useArticles();
  const { data: agenda } = useAgenda();
  const { data: jadwal } = useSchedule();
  const { data: anggota } = useMembers();
  const { data: galeri } = useGallery();

  const stats = [
    {
      title: t.articles.heading,
      count: articles.length,
      desc: interpolate(t.admin.publishedCount, {
        count: articles.filter((p) => p.published).length,
      }),
      link: "/admin/artikel",
      icon: FileText,
    },
    {
      title: t.admin.agenda,
      count: agenda.length,
      desc: t.admin.recordedEvents,
      link: "/admin/agenda",
      icon: CalendarDays,
    },
    {
      title: t.admin.schedule,
      count: jadwal.length,
      desc: t.admin.teachingHours,
      link: "/admin/jadwal",
      icon: CalendarCheck2,
    },
    {
      title: t.admin.members,
      count: anggota.length,
      desc: t.admin.registeredStudents,
      link: "/admin/anggota",
      icon: Users,
    },
    {
      title: t.admin.gallery,
      count: galeri.length,
      desc: t.admin.savedPhotos,
      link: "/admin/galeri",
      icon: ImageIcon,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        nomor="ADM"
        label={t.admin.overview}
        title={t.admin.dashboardTitle}
        description={interpolate(t.admin.dashboardDesc, {
          name: user?.name || "—",
        })}
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
                <span>{t.admin.manageModules}</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </AdminLayout>
  );
}

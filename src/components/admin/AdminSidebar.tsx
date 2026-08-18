import { Link, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Megaphone,
  CalendarDays,
  CalendarCheck2,
  Users,
  Image as ImageIcon,
  Building2,
  ShieldCheck,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { KelasMark } from "@/components/site/KelasMark";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  onItemClick?: () => void;
}

export function AdminSidebar({ onItemClick }: AdminSidebarProps) {
  const { user, isOwner, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = [
    { to: "/admin", label: "Ringkasan", icon: LayoutDashboard, end: true },
    { to: "/admin/pengumuman", label: "Pengumuman", icon: Megaphone },
    { to: "/admin/agenda", label: "Agenda Kelas", icon: CalendarDays },
    { to: "/admin/jadwal", label: "Jadwal Pelajaran", icon: CalendarCheck2 },
    { to: "/admin/anggota", label: "Anggota Kelas", icon: Users },
    { to: "/admin/galeri", label: "Galeri Foto", icon: ImageIcon },
    { to: "/admin/organisasi", label: "Identitas & Org", icon: Building2 },
    ...(isOwner
      ? [{ to: "/admin/users", label: "Manajemen User", icon: ShieldCheck }]
      : []),
  ];

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-border/80 bg-card/60 p-5 text-foreground backdrop-blur-md">
      <div>
        {/* Header Identitas */}
        <Link
          to="/"
          className="group flex items-center gap-3 border-b border-border/70 pb-4"
          onClick={onItemClick}
        >
          <KelasMark className="size-9 text-primary transition-colors group-hover:text-accent" />
          <div className="leading-tight">
            <span className="block font-display text-base font-semibold tracking-tight">
              Panel Pengurus
            </span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              X TKJ 1 · SMKN 1 Cerme
            </span>
          </div>
        </Link>

        {/* User Card */}
        <div className="mt-4 rounded border border-border/60 bg-background/50 p-2.5">
          <p className="kicker text-[9px]">Sesi Masuk</p>
          <p className="truncate font-display text-sm font-medium">
            {user?.name || user?.email || "Pengurus"}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={cn(
                "inline-block rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                isOwner
                  ? "bg-accent/20 text-accent font-semibold"
                  : "bg-primary/20 text-primary font-semibold"
              )}
            >
              {user?.role}
            </span>
            <Link
              to="/"
              className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground"
            >
              Web Utama <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 flex flex-col gap-1">
          <p className="kicker mb-1 px-2 text-[9px]">Menu Kelola</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onItemClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded px-3 py-2 text-[13.5px] transition-colors",
                    isActive
                      ? "border border-border/80 bg-primary font-medium text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-card/80 hover:text-foreground"
                  )
                }
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Keluar */}
      <div className="border-t border-border/70 pt-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full cursor-pointer items-center gap-2 rounded px-3 py-2 text-[13px] text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          <span>Keluar dari Panel</span>
        </button>
      </div>
    </aside>
  );
}

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { LayoutDashboard, LogOut, UserX, ShieldCheck, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router";

export default function Dashboard() {
  const { user, isAdmin, signOut } = useAuth();
  const { t, interpolate } = useTranslation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const nama = user?.guest ? t.dashboard.guestName : user?.name ?? t.dashboard.memberName;
  const peran =
    user?.guest
      ? t.dashboard.roleGuest
      : user?.role === "owner"
      ? t.dashboard.roleOwner
      : user?.role === "admin"
      ? t.dashboard.roleAdmin
      : t.dashboard.roleMember;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <section className="glass glass-hover w-full max-w-xl">
        <div className="px-7 py-9 sm:px-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-4 flex size-11 items-center justify-center border border-border bg-background/40 font-display text-lg italic">
                {user?.guest ? (
                  <UserX className="size-5 text-muted-foreground" aria-hidden />
                ) : (
                  nama.charAt(0)
                )}
              </div>
              <p className="kicker text-[10px]">
                {interpolate(t.dashboard.badge, { role: peran })}
              </p>
              <h1 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
                {interpolate(t.dashboard.welcome, { name: nama })}
              </h1>
            </div>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer gap-2 self-start border-border/80 bg-background/40"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              {t.dashboard.signOutBtn}
            </Button>
          </div>

          <div className="rule-double mt-7" aria-hidden />

          {/* Quick link ke Admin Panel jika user adalah admin / owner */}
          {isAdmin && (
            <div className="mt-6 flex items-center justify-between border border-primary/40 bg-primary/10 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-primary" />
                <div>
                  <p className="font-display font-medium text-primary">
                    {t.dashboard.adminAccessTitle}
                  </p>
                  <p className="text-[12.5px] text-muted-foreground">
                    {t.dashboard.adminAccessDesc}
                  </p>
                </div>
              </div>
              <Link
                to="/admin"
                className="inline-flex shrink-0 items-center gap-1.5 bg-primary px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <span>{t.dashboard.openAdminBtn}</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}

          <div className="mt-6 flex items-start gap-4 border border-border/70 bg-background/40 px-4 py-4">
            <div className="flex size-9 shrink-0 items-center justify-center bg-primary/10 text-primary">
              <LayoutDashboard className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-medium tracking-tight">
                {t.dashboard.workspaceTitle}
              </h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                {user?.guest
                  ? t.dashboard.guestWorkspaceDesc
                  : t.dashboard.memberWorkspaceDesc}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              to="/"
              className="font-mono text-[11px] uppercase tracking-wider text-accent underline underline-offset-4 hover:text-accent/80"
            >
              {t.dashboard.backHome}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

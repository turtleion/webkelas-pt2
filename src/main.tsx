import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { RequireOwner } from "@/components/admin/RequireOwner";
import { PreferencesProvider } from "@/context/PreferencesContext";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load public route components
const Home = lazy(() => import("./pages/Home.tsx"));
const Anggota = lazy(() => import("./pages/Anggota.tsx"));
const Organisasi = lazy(() => import("./pages/Organisasi.tsx"));
const Jadwal = lazy(() => import("./pages/Jadwal.tsx"));
const Pengumuman = lazy(() => import("./pages/Pengumuman.tsx"));
const Agenda = lazy(() => import("./pages/Agenda.tsx"));
const Galeri = lazy(() => import("./pages/Galeri.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Lazy load admin route components
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminAnnouncements = lazy(() => import("./pages/admin/AdminAnnouncements.tsx"));
const AdminAgenda = lazy(() => import("./pages/admin/AdminAgenda.tsx"));
const AdminSchedule = lazy(() => import("./pages/admin/AdminSchedule.tsx"));
const AdminMembers = lazy(() => import("./pages/admin/AdminMembers.tsx"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery.tsx"));
const AdminOrganization = lazy(() => import("./pages/admin/AdminOrganization.tsx"));
const AdminTheme = lazy(() => import("./pages/admin/AdminTheme.tsx"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse font-mono text-xs uppercase tracking-wider text-muted-foreground">
        Memuat halaman...
      </div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in WebContainer environment). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[WebContainer preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Gulir ke atas setiap kali pindah halaman (tanpa ini posisi scroll
 *  ikut terbawa saat navigasi antar halaman arsip). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <PreferencesProvider>
        <BrowserRouter>
          <RouteSyncer />
          <ScrollToTop />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/anggota" element={<Anggota />} />
              <Route path="/organisasi" element={<Organisasi />} />
              <Route path="/jadwal" element={<Jadwal />} />
              <Route path="/pengumuman" element={<Pengumuman />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/galeri" element={<Galeri />} />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="/auth"
                element={<AuthPage redirectAfterAuth="/dashboard" />}
              />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminDashboard />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/pengumuman"
                element={
                  <RequireAdmin>
                    <AdminAnnouncements />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/agenda"
                element={
                  <RequireAdmin>
                    <AdminAgenda />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/jadwal"
                element={
                  <RequireAdmin>
                    <AdminSchedule />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/anggota"
                element={
                  <RequireAdmin>
                    <AdminMembers />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/galeri"
                element={
                  <RequireAdmin>
                    <AdminGallery />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/organisasi"
                element={
                  <RequireAdmin>
                    <AdminOrganization />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/theme"
                element={
                  <RequireAdmin>
                    <AdminTheme />
                  </RequireAdmin>
                }
              />

              {/* Owner-Only Protected Routes */}
              <Route
                path="/admin/users"
                element={
                  <RequireOwner>
                    <AdminUsers />
                  </RequireOwner>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </PreferencesProvider>
    </RootErrorBoundary>
  </StrictMode>,
);

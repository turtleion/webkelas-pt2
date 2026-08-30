import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { RequireOwner } from "@/components/admin/RequireOwner";
import { AuthStateRedirector } from "@/components/AuthStateRedirector";
import { RequireAuth } from "@/components/RequireAuth";
import { Toaster } from "@/components/ui/sonner";
import { PreferencesProvider } from "@/context/PreferencesContext";
import "@vly-ai/integrations";
import React, { lazy, StrictMode, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { RequireVerified } from "./components/RequireVerified";
import "./index.css";

// Lazy load public route components
const Home = lazy(() => import("./pages/Home.tsx"));
const Anggota = lazy(() => import("./pages/Anggota.tsx"));
const Organisasi = lazy(() => import("./pages/Organisasi.tsx"));
const Jadwal = lazy(() => import("./pages/Jadwal.tsx"));
const Artikel = lazy(() => import("./pages/Artikel.tsx"));
const ArtikelDetail = lazy(() => import("./pages/ArtikelDetail.tsx"));
const Tugas = lazy(() => import("./pages/Tugas.tsx"));
const TugasDetail = lazy(() => import("./pages/TugasDetail.tsx"));
const Agenda = lazy(() => import("./pages/Agenda.tsx"));
const AdminTugas = lazy(() => import("./pages/admin/AdminTugas.tsx"));
const Galeri = lazy(() => import("./pages/Galeri.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Register = lazy(() => import("./pages/Register.tsx"));
const Pentest = lazy(() => import("./pages/Pentest.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Lazy load admin route components
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminAgenda = lazy(() => import("./pages/admin/AdminAgenda.tsx"));
const AdminSchedule = lazy(() => import("./pages/admin/AdminSchedule.tsx"));
const AdminMembers = lazy(() => import("./pages/admin/AdminMembers.tsx"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery.tsx"));
const AdminOrganization = lazy(
  () => import("./pages/admin/AdminOrganization.tsx"),
);
const AdminTheme = lazy(() => import("./pages/admin/AdminTheme.tsx"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers.tsx"));
const AdminInvitationCodes = lazy(
  () => import("./pages/admin/AdminInvitationCodes.tsx"),
);
const AdminArticles = lazy(
  () => import("./pages/admin/AdminArticles.tsx"),
);
const AdminMbg = lazy(
  () => import("./pages/admin/AdminMbg.tsx"),
);
const AdminDuty = lazy(
  () => import("./pages/admin/AdminDuty.tsx"),
);

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
          <AuthStateRedirector />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/anggota" element={<Anggota />} />
              <Route path="/organisasi" element={<Organisasi />} />
              <Route
                path="/jadwal"
                element={
                  <RequireVerified>
                    <Jadwal />
                  </RequireVerified>
                }
              />
              <Route
                path="/agenda"
                element={
                  <RequireVerified>
                    <Agenda />
                  </RequireVerified>
                }
              />
              <Route
                path="/tugas"
                element={
                  <RequireVerified>
                    <Tugas />
                  </RequireVerified>
                }
              />
              <Route
                path="/tugas/:slug"
                element={
                  <RequireVerified>
                    <TugasDetail />
                  </RequireVerified>
                }
              />
              <Route
                path="/artikel"
                element={
                  <RequireVerified>
                    <Artikel />
                  </RequireVerified>
                }
              />
              <Route
                path="/artikel/:slug"
                element={
                  <RequireVerified>
                    <ArtikelDetail />
                  </RequireVerified>
                }
              />
              <Route path="/galeri" element={<Galeri />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pentest" element={<Pentest />} />
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
                path="/admin/artikel"
                element={
                  <RequireAdmin>
                    <AdminArticles />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/mbg"
                element={
                  <RequireAdmin>
                    <AdminMbg />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/piket"
                element={
                  <RequireAdmin>
                    <AdminDuty />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/tugas"
                element={
                  <RequireAdmin>
                    <AdminTugas />
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
              <Route
                path="/admin/invitation-codes"
                element={
                  <RequireOwner>
                    <AdminInvitationCodes />
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

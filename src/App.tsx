import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { DashboardSkeleton } from "./components/SkeletonLoader.tsx";
import { DashboardPage } from "./pages/Dashboard.page.tsx";
import { TicketsPage } from "./pages/Tickets.page.tsx";
import { TimeTrackingPage } from "./pages/TimeTracking.page.tsx";
import { TeamMeetingPage } from "./pages/TeamMeeting.page.tsx";
import { RetroPage } from "./pages/Retro.page.tsx";
import { ReviewPage } from "./pages/Review.page.tsx";
import { SharePage } from "./pages/Share.page.tsx";
import { TemplatePage } from "./pages/Template.page.tsx";
import { NotesPage } from "./pages/Notes.page.tsx";
import { SnippetsPage } from "./pages/Snippets.page.tsx";
import { VcsPage } from "./pages/Vcs.page.tsx";
import { SettingsPage } from "./pages/Settings.page.tsx";
import { DatabaseQueryPage } from "./pages/DatabaseQuery.page.tsx";
import { CsvViewerPage } from "./pages/CsvViewer.page.tsx";

import { ToastProvider } from "./toaster/ToastContext.tsx";
import { SettingsProvider } from "./context/SettingsContext.tsx";
import { TicketProvider, useTickets } from "./context/TicketContext.tsx";
import { useVCS, VcsProvider } from "./context/VcsContext.tsx";
import { KPIProvider } from "./context/KPIContext.tsx";
import { TimeProvider, useTime } from "./context/TimeContext.tsx";
import { InfoProvider } from "./context/InfoContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import {
  ConnectionProvider,
  useConnection,
} from "./context/ConnectionConntext.tsx";

import { pushService } from "./services/push/push.service.ts";
import { LoginPage } from "./components/auth/LoginPage.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";
import { NoConnectionPage } from "./components/overlays/no-connection/NoConnection.tsx";
import { GlobalErrorOverlay } from "./components/overlays/error/ErrorOverlay.tsx";
import { LicenseGuard } from "./components/license/LicenseGuard.tsx";
import LogViewerPage from "./pages/LogViewer.page.tsx";
import ToolsPage from "./pages/Tools.page.tsx";
import MockDataPage from "./pages/MockData.page.tsx";
import RuleGeneratorPage from "./pages/RuleGenerator.page.tsx";
import { LicenseProvider, useLicense } from "./context/LicenseContext.tsx";
import { InsufficientLicenseGuard } from "./components/license/InssuficientLicense.tsx";
import { AboutPage } from "./pages/About.page.tsx";
import { AboutProvider } from "./context/AboutContext.tsx";
import PlanSelectionPage from "./pages/public/PlanSelection.page.tsx";

import { getAppBackgroundStyles } from "./utils/license.util.ts";
import { WeeklyTimeWarningOverlay } from "./components/overlays/warning/WeeklyTimeWarningOverlay.tsx";
import { TimeLogModal } from "./components/dashboard";
import { SessionReauthModal } from "./components/auth/SessionReauthModal.tsx";
import { HttpStatusPage } from "./pages/Http.status.page.tsx";
import HttpMethodsPage from "./pages/Http.methods.page.tsx";
import CheatsheetPage from "./pages/Cheatsheet.page.tsx";
import { TeapotOverlay } from "./components/overlays/teapot/TeapotOverlay.tsx";

const AuthenticatedLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTimeLogModalOpen, setIsTimeLogModalOpen] = useState(false);

  const { plan } = useLicense();
  const { fetchTickets } = useTickets();
  const { fetchTimeEntries } = useTime();
  const { fetchAll } = useVCS();

  const handleTriggerRefresh = async () => {
    setIsLoading(true);

    await Promise.allSettled([
      fetchTickets(),
      fetchTimeEntries(),
      fetchAll(true),
    ]);

    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  useEffect(() => {
    pushService.connect();
  }, []);

  const appBgStyle = getAppBackgroundStyles(plan);

  return (
    <div
      className={`flex h-screen ${appBgStyle} text-slate-100 overflow-hidden font-sans transition-colors duration-500`}
    >
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
          onTriggerRefresh={handleTriggerRefresh}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <InsufficientLicenseGuard minPlan="COMMUNITY">
                    <DashboardPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route path="/about" element={<AboutPage />} />
              <Route
                path="/vcs"
                element={
                  <InsufficientLicenseGuard minPlan="COMMUNITY">
                    <VcsPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route
                path="/redmine"
                element={
                  <InsufficientLicenseGuard minPlan="COMMUNITY">
                    <TicketsPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route path="/settings" element={<SettingsPage />} />

              <Route
                path="/notes"
                element={
                  <InsufficientLicenseGuard minPlan="PRO">
                    <NotesPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route
                path="/snippets"
                element={
                  <InsufficientLicenseGuard minPlan="PRO">
                    <SnippetsPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route
                path="/templates"
                element={
                  <InsufficientLicenseGuard minPlan="PRO">
                    <TemplatePage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route
                path="/time-log"
                element={
                  <InsufficientLicenseGuard minPlan="PRO">
                    <TimeTrackingPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route
                path="/share"
                element={
                  <InsufficientLicenseGuard minPlan="PRO">
                    <SharePage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route
                path="/log"
                element={
                  <InsufficientLicenseGuard minPlan="PRO">
                    <LogViewerPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route
                path="/tools"
                element={
                  <InsufficientLicenseGuard minPlan="PRO">
                    <ToolsPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route
                path="/retro"
                element={
                  <InsufficientLicenseGuard minPlan="PRO">
                    <RetroPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route
                path="/teammeeting"
                element={
                  <InsufficientLicenseGuard minPlan="PRO">
                    <TeamMeetingPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route
                path="/review"
                element={
                  <InsufficientLicenseGuard minPlan="PRO">
                    <ReviewPage />
                  </InsufficientLicenseGuard>
                }
              />

              {/* --- ENTERPRISE TIER --- */}
              <Route
                path="/database"
                element={
                  <InsufficientLicenseGuard minPlan="ENTERPRISE">
                    <DatabaseQueryPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route
                path="/csv-viewer"
                element={
                  <InsufficientLicenseGuard minPlan="ENTERPRISE">
                    <CsvViewerPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route
                path="/mock-data"
                element={
                  <InsufficientLicenseGuard minPlan="ENTERPRISE">
                    <MockDataPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route
                path="/rule-generator"
                element={
                  <InsufficientLicenseGuard minPlan="ENTERPRISE">
                    <RuleGeneratorPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route
                path="/http-status"
                element={
                  <InsufficientLicenseGuard minPlan="COMMUNITY">
                    <HttpStatusPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route
                path="/http-methods"
                element={
                  <InsufficientLicenseGuard minPlan="COMMUNITY">
                    <HttpMethodsPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route
                path="/cheats"
                element={
                  <InsufficientLicenseGuard minPlan="COMMUNITY">
                    <CheatsheetPage />
                  </InsufficientLicenseGuard>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
      </div>

      {/* Freitags-Warnung mit Snooze & Acknowledge */}
      <WeeklyTimeWarningOverlay
        onOpenTimeLogModal={() => setIsTimeLogModalOpen(true)}
      />

      {/* Zeiterfassungsmodal */}
      <TimeLogModal
        isOpen={isTimeLogModalOpen}
        onClose={() => setIsTimeLogModalOpen(false)}
      />
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { isConnected } = useConnection();

  if (!isConnected) {
    return <NoConnectionPage />;
  }

  return (
    <Routes>
      <Route path="/public/share/*" element={<SharePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/plans" element={<PlanSelectionPage />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <LicenseGuard renewUrl="/license/renew">
              <InfoProvider>
                <TimeProvider>
                  <VcsProvider>
                    <TicketProvider>
                      <KPIProvider>
                        <GlobalErrorOverlay />
                        <AuthenticatedLayout />
                      </KPIProvider>
                    </TicketProvider>
                  </VcsProvider>
                </TimeProvider>
              </InfoProvider>
            </LicenseGuard>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export const App: React.FC = () => {
  const [isTeapotOpen, setIsTeapotOpen] = useState(false);

  useEffect(() => {
    const handleTeapotTrigger = () => {
      setIsTeapotOpen(true);
    };

    window.addEventListener("http:418-teapot", handleTeapotTrigger);

    return () => {
      window.removeEventListener("http:418-teapot", handleTeapotTrigger);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <SessionReauthModal />

        <LicenseProvider>
          <ConnectionProvider>
            <ToastProvider>
              <SettingsProvider>
                <AboutProvider>
                  <AppRoutes />

                  {/* Globales 418 I'm a Teapot Overlay */}
                  <TeapotOverlay
                    isOpen={isTeapotOpen}
                    onClose={() => setIsTeapotOpen(false)}
                  />
                </AboutProvider>
              </SettingsProvider>
            </ToastProvider>
          </ConnectionProvider>
        </LicenseProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

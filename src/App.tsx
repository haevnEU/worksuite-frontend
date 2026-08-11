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
import { DashboardPage } from "./pages/DashboardPage.tsx";
import { TicketsPage } from "./pages/TicketsPage.tsx";
import { TimeTrackingPage } from "./pages/TimeTrackingPage.tsx";
import { TeamMeetingPage } from "./pages/TeamMeetingPage.tsx";
import { RetroPage } from "./pages/RetroPage.tsx";
import { ReviewPage } from "./pages/ReviewPage.tsx";
import { SharePage } from "./pages/SharePage.tsx";
import { TemplatePage } from "./pages/TemplatePage.tsx";
import { NotesPage } from "./pages/NotesPage.tsx";
import { SnippetsPage } from "./pages/SnippetsPage.tsx";
import { VcsPage } from "./pages/VcsPage.tsx";
import { SettingsPage } from "./pages/SettingsPage.tsx";
import { DatabaseQueryPage } from "./pages/DatabaseQueryPage.tsx";
import { CsvViewerPage } from "./pages/CsvViewerPage.tsx";

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
import LogViewerPage from "./pages/LogViewerPage.tsx";
import ToolsPage from "./pages/ToolsPage.tsx";
import MockDataPage from "./pages/MockDataPage.tsx";
import RuleGeneratorPage from "./pages/RuleGeneratorPage.tsx";
import { LicenseProvider } from "./context/LicenseContext.tsx";
import { InsufficientLicenseGuard } from "./components/license/InssuficientLicense.tsx";
import { AboutPage } from "./pages/AboutPage.tsx";
import { AboutProvider } from "./context/AboutContext.tsx";
import PlanSelectionPage from "./pages/public/PlanSelectionPage.tsx";

const AuthenticatedLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { fetchTickets } = useTickets();
  const { fetchTimeEntries } = useTime();
  const { fetchPipeline, fetchMergeRequests, fetchRepos } = useVCS();

  const handleTriggerRefresh = async () => {
    setIsLoading(true);

    await fetchTickets();
    await fetchTimeEntries();
    await fetchPipeline();
    await fetchMergeRequests();
    await fetchRepos();

    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    pushService.connect();
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { isConnected, retryConnection } = useConnection();

  if (!isConnected) {
    return <NoConnectionPage onRetry={retryConnection} />;
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
  return (
    <Router>
      <AuthProvider>
        <LicenseProvider>
          <ConnectionProvider>
            <ToastProvider>
              <SettingsProvider>
                <AboutProvider>
                  <AppRoutes />
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

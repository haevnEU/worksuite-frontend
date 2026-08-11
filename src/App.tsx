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
import LogViewerPage from "./pages/LogViewer.page.tsx";
import ToolsPage from "./pages/Tools.page.tsx";
import MockDataPage from "./pages/MockData.page.tsx";
import RuleGeneratorPage from "./pages/RuleGenerator.page.tsx";
import { LicenseProvider, useLicense } from "./context/LicenseContext.tsx";
import { AboutPage } from "./pages/About.page.tsx";
import { AboutProvider } from "./context/AboutContext.tsx";
import PlanSelectionPage from "./pages/public/PlanSelection.page.tsx";

import { getAppBackgroundStyles } from "./utils/license.util.ts";
import { WeeklyTimeWarningOverlay } from "./components/overlays/warning/WeeklyTimeWarningOverlay.tsx";
import { TimeLogModal } from "./components/dashboard";
import { HttpStatusPage } from "./pages/Http.status.page.tsx";
import HttpMethodsPage from "./pages/Http.methods.page.tsx";
import CheatsheetPage from "./pages/Cheatsheet.page.tsx";
import { HttpEventsHandler } from "./context/httpEventContext.tsx";

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
              <Route path="/" element={<DashboardPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/vcs" element={<VcsPage />} />
              <Route path="/redmine" element={<TicketsPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              <Route path="/notes" element={<NotesPage />} />
              <Route path="/snippets" element={<SnippetsPage />} />
              <Route path="/templates" element={<TemplatePage />} />
              <Route path="/time-log" element={<TimeTrackingPage />} />
              <Route path="/share" element={<SharePage />} />
              <Route path="/log" element={<LogViewerPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/retro" element={<RetroPage />} />
              <Route path="/teammeeting" element={<TeamMeetingPage />} />
              <Route path="/review" element={<ReviewPage />} />

              <Route path="/database" element={<DatabaseQueryPage />} />
              <Route path="/csv-viewer" element={<CsvViewerPage />} />
              <Route path="/mock-data" element={<MockDataPage />} />
              <Route path="/rule-generator" element={<RuleGeneratorPage />} />
              <Route path="/http-status" element={<HttpStatusPage />} />
              <Route path="/http-methods" element={<HttpMethodsPage />} />
              <Route path="/cheats" element={<CheatsheetPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
      </div>

      <WeeklyTimeWarningOverlay
        onOpenTimeLogModal={() => setIsTimeLogModalOpen(true)}
      />

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
        <LicenseProvider>
          <ConnectionProvider>
            <ToastProvider>
              <SettingsProvider>
                <AboutProvider>
                  <HttpEventsHandler>
                    <AppRoutes />
                  </HttpEventsHandler>
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

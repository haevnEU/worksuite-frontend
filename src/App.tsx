import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Sidebar } from "./components/sidebar/Sidebar.tsx";
import { Header } from "./components/header/Header.tsx";
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
import { WeeklyMeetingPage } from "./pages/WeeklyMeetingPage.tsx";
import { CsvViewerPage } from "./pages/CsvViewerPage.tsx";
import { NoConnectionPage } from "./pages/NoConnection.tsx";

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
              <Route path="/" element={<DashboardPage />} />
              <Route path="/snippets" element={<SnippetsPage />} />
              <Route path="/templates" element={<TemplatePage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/database" element={<DatabaseQueryPage />} />
              <Route path="/retro" element={<RetroPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/wm" element={<WeeklyMeetingPage />} />
              <Route path="/redmine" element={<TicketsPage />} />
              <Route path="/teammeeting" element={<TeamMeetingPage />} />
              <Route path="/csv-viewer" element={<CsvViewerPage />} />
              <Route path="/vcs" element={<VcsPage />} />
              <Route path="/time-log" element={<TimeTrackingPage />} />
              <Route path="/review" element={<ReviewPage />} />
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

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <InfoProvider>
              <TimeProvider>
                <VcsProvider>
                  <TicketProvider>
                    <KPIProvider>
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
  return (
    <Router>
      <AuthProvider>
        <ConnectionProvider>
          <ToastProvider>
            <SettingsProvider>
              <AppRoutes />
            </SettingsProvider>
          </ToastProvider>
        </ConnectionProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

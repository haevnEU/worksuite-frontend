import React, { useState } from "react";
import {
  DashboardHeader,
  ProcessedTicketsWidget,
  QuickStatsGrid,
  TimeLogModal,
  VcsRepositoriesSection,
} from "../components/dashboard";

export const DashboardPage: React.FC = () => {
  const [isTimeLogModalOpen, setIsTimeLogModalOpen] = useState(false);

  return (
    <div className="space-y-8 pb-12 font-sans">
      <DashboardHeader />
      <QuickStatsGrid onOpenTimeLogModal={() => setIsTimeLogModalOpen(true)} />
      <ProcessedTicketsWidget />
      <VcsRepositoriesSection />
      <TimeLogModal
        isOpen={isTimeLogModalOpen}
        onClose={() => setIsTimeLogModalOpen(false)}
      />
    </div>
  );
};

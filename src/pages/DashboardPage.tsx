import React, { useState } from "react";
import { DashboardHeader } from "../components/dashboard/DashboardHeader.tsx";
import { QuickStatsGrid } from "../components/dashboard/QuickStatsGrid.tsx";
import { ProcessedTicketsWidget } from "../components/dashboard/ProcessedTicketsWidget.tsx";
import { VcsRepositoriesSection } from "../components/dashboard/VcsRepositoriesSection.tsx";
import { TimeLogModal } from "../components/dashboard/TimeLogModal.tsx";

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

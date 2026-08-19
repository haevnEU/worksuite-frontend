import React, { useState } from "react";
import { useSettings } from "../context/SettingsContext.tsx";
import { DashboardHeader } from "../components/dashboard/DashboardHeader.tsx";
import { QuickStatsGrid } from "../components/dashboard/QuickStatsGrid.tsx";
import { ProcessedTicketsWidget } from "../components/dashboard/ProcessedTicketsWidget.tsx";
import { VcsRepositoriesSection } from "../components/dashboard/VcsRepositoriesSection.tsx";
import { TimeLogModal } from "../components/dashboard/TimeLogModal.tsx";
import { FeatureGateCard } from "../components/dashboard/FeatureGateCard.tsx";

export const DashboardPage: React.FC = () => {
    const { hasRedmineKey, hasVcsKey } = useSettings();
    const [isTimeLogOpen, setIsTimeLogOpen] = useState(false);

    return (
        <div className="space-y-6 pb-12 font-sans">
            <DashboardHeader />

            {/* Redmine Ticket Quick Stats & Time Tracker */}
            <FeatureGateCard
                hasKey={hasRedmineKey}
                featureName="Ticket Stats & Time Tracking"
                serviceName="Redmine"
                accentColor="blue"
            >
                <QuickStatsGrid onOpenTimeLogModal={() => setIsTimeLogOpen(true)} />
            </FeatureGateCard>

            {/* Redmine KPI Tracker */}
            <FeatureGateCard
                hasKey={hasRedmineKey}
                featureName="KPI & Processed Tickets Tracker"
                serviceName="Redmine"
                accentColor="blue"
            >
                <ProcessedTicketsWidget />
            </FeatureGateCard>

            {/* VCS Repositories & Pipeline Overview */}
            <FeatureGateCard
                hasKey={hasVcsKey}
                featureName="Repositories & Pipelines"
                serviceName="GitLab"
                accentColor="orange"
            >
                <VcsRepositoriesSection />
            </FeatureGateCard>

            {/* Modal wird nur geöffnet, wenn Redmine Key aktiv ist */}
            {hasRedmineKey && (
                <TimeLogModal
                    isOpen={isTimeLogOpen}
                    onClose={() => setIsTimeLogOpen(false)}
                />
            )}
        </div>
    );
};
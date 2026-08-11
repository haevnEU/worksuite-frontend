import React from "react";
import { LicensePlan } from "../../types/license.type.ts";
import { PlanCard } from "../../components/license/PlanCard.tsx";

interface PlanGridSectionProps {
    currentPlan: LicensePlan | "NONE";
    isSubmitting: boolean;
    activeActionPlan: LicensePlan | null;
    onSelectPlan: (plan: LicensePlan) => void;
}

export const PlanGridSection: React.FC<PlanGridSectionProps> = ({
                                                                    currentPlan,
                                                                    isSubmitting,
                                                                    activeActionPlan,
                                                                    onSelectPlan,
                                                                }) => {
    return (
        <div className="space-y-8 sm:space-y-12">
            <div className="text-center space-y-2 sm:space-y-3">
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    Select Subscription Tier
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                    Choose the right access tier for your developer tools, issue
                    synchronization, and analytics suites.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                <PlanCard
                    plan="COMMUNITY"
                    title="Community"
                    badgeLabel="Community"
                    description="Essential local productivity features for standalone development and tracking."
                    features={[
                        "Dashboard & General Overview",
                        "Redmine Ticket Explorer",
                        "GitLab & VCS Dashboard",
                    ]}
                    currentPlan={currentPlan}
                    isUpdating={isSubmitting && activeActionPlan === "COMMUNITY"}
                    onSelect={onSelectPlan}
                />

                <PlanCard
                    plan="PRO"
                    title="Pro"
                    badgeLabel="Professional"
                    description="Advanced daily workflow features, notes, retrospective tools, and time logs."
                    features={[
                        "Everything in Community",
                        "Time Tracking & Logging Sync",
                        "Notes, Snippets & Templates",
                        "Meeting Prep, Retro & Review",
                    ]}
                    currentPlan={currentPlan}
                    isUpdating={isSubmitting && activeActionPlan === "PRO"}
                    onSelect={onSelectPlan}
                />

                <PlanCard
                    plan="ENTERPRISE"
                    title="Enterprise"
                    badgeLabel="Full Suite"
                    description="Full tool suite with direct database query access, mock data generators, and CSV tooling."
                    features={[
                        "Everything in Pro",
                        "Native SQL / Database Console",
                        "CSV Tooling & Rule Generator",
                        "Mock Data Engine",
                    ]}
                    currentPlan={currentPlan}
                    isUpdating={isSubmitting && activeActionPlan === "ENTERPRISE"}
                    onSelect={onSelectPlan}
                />
            </div>
        </div>
    );
};
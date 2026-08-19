import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext.tsx";
import { useLicense } from "../../context/LicenseContext.tsx";
import { useToast } from "../../toaster/ToastContext.tsx";
import { LicensePlan } from "../../types/license.type.ts";
import { ManualKeyActivationCard } from "../../components/license/ManualKeyActivationCard.tsx";
import {
    LicenseKeyDetailCard,
    NoPlanWarningAlert,
    PlanGridSection,
    PlanSelectionBackground,
    PlanSelectionHeader,
} from "../../components/plan";
import {licenseService} from "../../services/network/license.service.ts";

export const PlanSelectionPage: React.FC = () => {
    const { user } = useAuth();
    const { license, refreshLicense, renewLicense } = useLicense();
    const { toastGood, toastBad } = useToast();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [activeActionPlan, setActiveActionPlan] = useState<LicensePlan | null>(null);

    const currentPlan: LicensePlan | "NONE" = license?.plan || "NONE";
    const licenseKey = license?.licenseKey || null;

    const handleSelectPlan = async (targetPlan: LicensePlan) => {
        setIsSubmitting(true);
        setActiveActionPlan(targetPlan);
        try {
            await licenseService.assignPlan(targetPlan);
            await refreshLicense();
            toastGood(`Plan successfully switched to ${targetPlan}!`);
        } catch (err: any) {
            toastBad(err?.message || "Failed to switch plan.");
        } finally {
            setIsSubmitting(false);
            setActiveActionPlan(null);
        }
    };

    const handleManualActivate = async (key: string) => {
        setIsSubmitting(true);
        try {
            await renewLicense(key);
            await refreshLicense();
            toastGood("License successfully activated.");
        } catch (err: any) {
            toastBad(err?.message || "Could not activate license key.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#020617] text-slate-100 min-h-screen flex flex-col justify-between font-sans antialiased selection:bg-slate-700 selection:text-white relative overflow-x-hidden">
            <PlanSelectionBackground currentPlan={currentPlan} />

            <PlanSelectionHeader currentPlan={currentPlan} username={`${user?.firstName}`} />

            <main className="max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 flex-1 relative z-10 space-y-10">
                {/* Warnung bei fehlendem Plan */}
                {currentPlan === "NONE" && <NoPlanWarningAlert />}

                {/* 1. Hauptfokus: Auswahl der Tarife */}
                <PlanGridSection
                    currentPlan={currentPlan}
                    isSubmitting={isSubmitting}
                    activeActionPlan={activeActionPlan}
                    onSelectPlan={handleSelectPlan}
                />

                {/* 2. Unterer Verwaltungsbereich: Schlüssel-Details & Manuelle Aktivierung */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch pt-4">
                    <LicenseKeyDetailCard
                        licenseKey={licenseKey}
                        currentPlan={currentPlan}
                        expiresAt={license?.expiresAt}
                    />

                    <ManualKeyActivationCard
                        onActivate={handleManualActivate}
                        isLoading={isSubmitting}
                    />
                </div>

                <div className="pt-2 text-center">
                    <Link
                        to="/"
                        className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1.5 p-2"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Dashboard</span>
                    </Link>
                </div>
            </main>

            <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 relative z-10">
                &copy; Worksuite Developer Platform &bull; All rights reserved.
            </footer>
        </div>
    );
};

export default PlanSelectionPage;
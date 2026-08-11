import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { AboutHeader } from "../components/about/AboutHeader.tsx";
import { AboutKpiGrid } from "../components/about/AboutKpiGrid.tsx";
import { AboutDatabaseSection } from "../components/about/AboutDatabaseSection.tsx";
import { AboutRuntimeSection } from "../components/about/AboutRuntimeSection.tsx";
import { AboutRoutesSection } from "../components/about/AboutRoutesSection.tsx";
import { AboutHostSpecs } from "../components/about/AboutHostSpecs.tsx";
import { useAbout } from "../context/AboutContext.tsx";
import { useSettings } from "../context/SettingsContext.tsx";
import {ApiDocumentationSection} from "../components/about/ApiDocumentationSection.tsx";

export const AboutPage: React.FC = () => {
    const { systemInfo, isLoading, error, refreshSystemInfo } = useAbout();
    const { hasVcsKey, hasRedmineKey } = useSettings();
    const [clientUptime, setClientUptime] = useState<number>(0);

    useEffect(() => {
        const timer = setInterval(() => setClientUptime((prev) => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-6 pb-12 font-sans max-w-7xl mx-auto">
            <AboutHeader />

            {error && (
                <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{error}</span>
                </div>
            )}

            <AboutKpiGrid systemInfo={systemInfo} clientUptime={clientUptime} />

            <AboutDatabaseSection
                postgresInfo={systemInfo?.postgresInfo}
                mongoInfo={systemInfo?.mongoInfo}
                isLoading={isLoading}
                onRefresh={refreshSystemInfo}
            />

            <AboutRuntimeSection
                systemInfo={systemInfo}
                hasVcsKey={hasVcsKey}
                hasRedmineKey={hasRedmineKey}
            />

            <AboutHostSpecs />
            <ApiDocumentationSection />
            <AboutRoutesSection />

        </div>
    );
};
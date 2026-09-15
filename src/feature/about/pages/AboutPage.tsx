import React from "react";
import { AlertCircle } from "lucide-react";
import {
    AboutHeader,
    AboutKpiGrid,
    AboutDatabaseSection,
    AboutAiSection,
    AboutRuntimeSection,
    AboutHostSpecs,
    ApiDocumentationSection,
    AboutRoutesSection,
} from "../components";
import { AboutProvider, useAbout } from "../context/AboutContext";

const AboutPageContent: React.FC = () => {
    const { error } = useAbout();

    return (
        <div className="space-y-6 pb-12 font-sans max-w-7xl mx-auto">
            <AboutHeader />

            {error && (
                <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{error}</span>
                </div>
            )}

            <AboutKpiGrid />
            <AboutDatabaseSection />
            <AboutAiSection />
            <AboutRuntimeSection />
            <AboutHostSpecs />
            <ApiDocumentationSection />
            <AboutRoutesSection />
        </div>
    );
};

export const AboutPage: React.FC = () => {
    return (
        <AboutProvider>
            <AboutPageContent />
        </AboutProvider>
    );
};
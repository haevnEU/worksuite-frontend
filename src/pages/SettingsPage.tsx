import React from "react";
import { Settings } from "lucide-react";
import { GeneralProfileSection } from "../components/settings/GeneralProfileSection.tsx";
import { AvatarSection } from "../components/settings/AvatarSection.tsx";
import { PdfExportPreferencesSection } from "../components/settings/PdfExportPreferencesSection.tsx";
import { KpiSettingsSection } from "../components/settings/KpiSettingsSection.tsx";
import { AppearanceSection } from "../components/settings/AppearanceSection.tsx";
import { VcsKeySection } from "../components/settings/VcsKeySection.tsx";
import { RedmineKeySection } from "../components/settings/RedmineKeySection.tsx";
import { PasswordSection } from "../components/settings/PasswordSection.tsx";

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-16 font-sans w-full">
      <div className="flex items-center space-x-3.5 border-b border-slate-800 pb-5">
        <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage user profile, role, PDF export modes, KPI displays, and API
            access tokens
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <GeneralProfileSection />
        <AvatarSection />
        <PasswordSection />
        <PdfExportPreferencesSection />
        <KpiSettingsSection />
        <AppearanceSection />
        <VcsKeySection />
        <RedmineKeySection />
      </div>
    </div>
  );
};

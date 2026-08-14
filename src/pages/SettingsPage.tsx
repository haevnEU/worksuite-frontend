import React from "react";
import {
  AppearanceSection,
  AvatarSection,
  GeneralProfileSection,
  KpiSettingsSection,
  PasswordSection,
  PdfExportPreferencesSection,
  RedmineKeySection,
  SettingsHeader,
  VcsKeySection,
} from "../components/settings";

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 font-sans">
      <SettingsHeader />

      <div className="space-y-6">
        <GeneralProfileSection />
        <AvatarSection />
        <AppearanceSection />
        <PasswordSection />
        <PdfExportPreferencesSection />
        <KpiSettingsSection />
        <VcsKeySection />
        <RedmineKeySection />
      </div>
    </div>
  );
};

import React, { useState } from "react";
import {
  Settings,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  User,
  Shield,
  Key,
  Sparkles,
  BarChart2,
  FileText,
} from "lucide-react";

export const SettingsHeader: React.FC = () => {
  const [showGuide, setShowGuide] = useState<boolean>(false);

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 space-y-4 backdrop-blur shadow-lg">
      {/* Top Row: Icon, Title, Badge & Guide Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-wide">
                Settings & Preferences
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Configuration
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manage user profile, role, PDF export modes, KPI displays, and API
              access tokens.
            </p>
          </div>
        </div>

        {/* Guide Toggle Button */}
        <button
          type="button"
          onClick={() => setShowGuide((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer self-start md:self-center shrink-0 ${
            showGuide
              ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
              : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
          title="Toggle settings guide"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Guide</span>
          {showGuide ? (
            <ChevronUp className="w-3 h-3 ml-0.5" />
          ) : (
            <ChevronDown className="w-3 h-3 ml-0.5" />
          )}
        </button>
      </div>

      {/* Collapsible Guide Section */}
      {showGuide && (
        <div className="p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Settings & Preferences Overview</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* 1. Profile & Avatar */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span>Profile & Avatar</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  View your read-only account details (name, email, role) and
                  upload your profile picture (PNG, JPG, WebP).
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-blue-300 border-t border-slate-800/40">
                <span>Account: Read-Only · Avatar 80x80</span>
              </div>
            </div>

            {/* 2. Security & Password */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  <span>Security & Password</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Update your authentication password. Requires current
                  credentials and min. 8 characters.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-emerald-300 border-t border-slate-800/40">
                <span>Min. 8 characters requirement</span>
              </div>
            </div>

            {/* 3. API Integrations (VCS & Redmine) */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-orange-400 font-semibold mb-1">
                  <Key className="w-3.5 h-3.5 shrink-0" />
                  <span>API Key Tokens</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Configure and mask your personal access tokens for GitLab/VCS
                  repositories and Redmine ticket tracking.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-orange-300 border-t border-slate-800/40">
                <span>PAT: glpat-* · Redmine API Key</span>
              </div>
            </div>

            {/* 4. License & Plan */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>License & Plan Tier</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Inspect workspace validity, expiration dates, and activate
                  upgraded feature license keys (e.g. Pro, Enterprise).
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-purple-300 border-t border-slate-800/40">
                <span>Key Format: WS-XXXX-XXXX-...</span>
              </div>
            </div>

            {/* 5. KPI Chart Display */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1">
                  <BarChart2 className="w-3.5 h-3.5 shrink-0" />
                  <span>KPI Display Settings</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Toggle QA & Review metric series, choose between bar and line
                  renderers, customize metric colors, and set history ranges.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-indigo-300 border-t border-slate-800/40">
                <span>Ranges: 7, 14, 21 Days · Custom Colors</span>
              </div>
            </div>

            {/* 6. PDF Export Preferences */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span>PDF Export Options</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Toggle the draft watermark overlay for exported meeting
                  summaries, retro reports, and ticket PDFs.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-cyan-300 border-t border-slate-800/40">
                <span>Draft Watermark: On / Off</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

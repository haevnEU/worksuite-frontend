import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  GitBranch,
  Info,
  Key,
  Save,
  Server,
  ShieldCheck,
} from "lucide-react";
import { useSettings } from "../../context/SettingsContext.tsx";

export type VcsProviderType = "GITLAB" | "GITHUB";

export const VcsKeySection: React.FC = () => {
  const { hasVcsKey, vcsProvider, updateVcsProvider, updateVcsKey } =
    useSettings();
  const [vcsToken, setVcsToken] = useState<string>("");
  const [showVcsToken, setShowVcsToken] = useState(false);

  const provider = (vcsProvider as VcsProviderType) || "GITLAB";
  const isGitLab = provider === "GITLAB";

  // Dynamische CSS-Styles je nach Provider
  const theme = {
    accentText: isGitLab ? "text-orange-400" : "text-purple-400",
    badgeBg: isGitLab ? "bg-orange-950/60" : "bg-purple-950/60",
    badgeBorder: isGitLab ? "border-orange-800/60" : "border-purple-800/60",
    bannerBg: isGitLab ? "bg-orange-950/30" : "bg-purple-950/30",
    bannerBorder: isGitLab ? "border-orange-800/50" : "border-purple-800/50",
    bannerText: isGitLab ? "text-orange-200" : "text-purple-200",
    bannerTitle: isGitLab ? "text-orange-300" : "text-purple-300",
    focusRing: isGitLab
      ? "focus:ring-orange-500/30"
      : "focus:ring-purple-500/30",
    submitBtn: isGitLab
      ? "bg-orange-600 hover:bg-orange-500"
      : "bg-purple-600 hover:bg-purple-500",
    activeTab: isGitLab
      ? "bg-orange-600/20 border-orange-500 text-orange-300 shadow-sm"
      : "bg-purple-600/20 border-purple-500 text-purple-300 shadow-sm",
    codeTag: isGitLab ? "text-orange-400" : "text-purple-400",
  };

  const handleProviderChange = async (newProvider: VcsProviderType) => {
    await updateVcsProvider(newProvider);
  };

  const handleVcsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateVcsKey(vcsToken);
    setVcsToken("");
  };

  return (
    <form
      onSubmit={handleVcsSubmit}
      className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xs space-y-4 transition-colors"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <GitBranch
            className={`w-4 h-4 ${theme.accentText} transition-colors`}
          />
          <h2 className="text-sm font-extrabold text-white">VCS Integration</h2>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${theme.badgeBg} ${theme.accentText} border ${theme.badgeBorder} transition-colors`}
        >
          {isGitLab ? "GitLab CI/CD" : "GitHub Actions"}
        </span>
      </div>

      {/* Provider-Auswahl */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-300 flex items-center space-x-1.5">
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span>VCS Provider</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleProviderChange("GITLAB")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              isGitLab
                ? theme.activeTab
                : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <span>GitLab</span>
          </button>
          <button
            type="button"
            onClick={() => handleProviderChange("GITHUB")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              !isGitLab
                ? theme.activeTab
                : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <span>GitHub</span>
          </button>
        </div>
      </div>

      {hasVcsKey && (
        <div
          className={`p-3.5 ${theme.bannerBg} border ${theme.bannerBorder} rounded-xl flex items-start space-x-3 text-xs ${theme.bannerText} transition-colors`}
        >
          <ShieldCheck
            className={`w-4 h-4 ${theme.accentText} shrink-0 mt-0.5`}
          />
          <div>
            <p className={`font-bold ${theme.bannerTitle}`}>
              {provider} Token already configured
            </p>
            <p className="opacity-80 mt-0.5">
              For security reasons, the current token is hidden. Saving a new
              value will overwrite the existing key.
            </p>
          </div>
        </div>
      )}

      {/* Dynamischer Hinweis zu benötigten Token-Scopes */}
      <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-start space-x-3 text-xs text-slate-300">
        <Info
          className={`w-4 h-4 ${theme.accentText} shrink-0 mt-0.5 transition-colors`}
        />
        <div className="space-y-1">
          <p className="font-semibold text-slate-200">
            Erforderliche {isGitLab ? "GitLab" : "GitHub"} Scopes
          </p>
          {isGitLab ? (
            <p className="text-slate-400 leading-relaxed">
              Bitte erstelle in GitLab einen Personal Access Token mit folgenden
              Scopes:{" "}
              <code
                className={`px-1.5 py-0.5 bg-slate-950 ${theme.codeTag} rounded text-[11px] font-mono border border-slate-700`}
              >
                read_user
              </code>
              ,{" "}
              <code
                className={`px-1.5 py-0.5 bg-slate-950 ${theme.codeTag} rounded text-[11px] font-mono border border-slate-700`}
              >
                read_repository
              </code>{" "}
              und{" "}
              <code
                className={`px-1.5 py-0.5 bg-slate-950 ${theme.codeTag} rounded text-[11px] font-mono border border-slate-700`}
              >
                read_api
              </code>
              .
            </p>
          ) : (
            <p className="text-slate-400 leading-relaxed">
              Bitte erstelle in GitHub einen Personal Access Token mit folgenden
              Scopes:{" "}
              <code
                className={`px-1.5 py-0.5 bg-slate-950 ${theme.codeTag} rounded text-[11px] font-mono border border-slate-700`}
              >
                repo
              </code>
              ,{" "}
              <code
                className={`px-1.5 py-0.5 bg-slate-950 ${theme.codeTag} rounded text-[11px] font-mono border border-slate-700`}
              >
                read:user
              </code>{" "}
              und{" "}
              <code
                className={`px-1.5 py-0.5 bg-slate-950 ${theme.codeTag} rounded text-[11px] font-mono border border-slate-700`}
              >
                workflow
              </code>
              .
            </p>
          )}
        </div>
      </div>

      <div className="text-xs">
        <label className="block font-bold text-slate-300 mb-1.5 flex items-center space-x-1">
          <Key className="w-3.5 h-3.5 text-slate-400" />
          <span>{isGitLab ? "GitLab" : "GitHub"} Personal Access Token</span>
        </label>
        <div className="relative">
          <input
            type={showVcsToken ? "text" : "password"}
            value={vcsToken}
            onChange={(e) => setVcsToken(e.target.value)}
            placeholder={
              hasVcsKey
                ? `Enter new ${provider} key to overwrite...`
                : isGitLab
                  ? "glpat-xxxxxxxxxxxxxxxxxxxx"
                  : "ghp_xxxxxxxxxxxxxxxxxxxx"
            }
            required
            className={`w-full bg-slate-800 border border-slate-700 rounded-xl p-3 pr-10 text-white font-mono text-xs focus:outline-none focus:ring-2 ${theme.focusRing} transition-all`}
          />
          <button
            type="button"
            onClick={() => setShowVcsToken(!showVcsToken)}
            className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
          >
            {showVcsToken ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className={`px-5 py-2.5 ${theme.submitBtn} text-white font-bold rounded-xl transition-all text-xs flex items-center space-x-2 cursor-pointer shadow-md`}
        >
          <Save className="w-4 h-4" />
          <span>
            {hasVcsKey ? `Override ${provider} Key` : `Save ${provider} Key`}
          </span>
        </button>
      </div>
    </form>
  );
};
